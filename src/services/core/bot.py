import sqlite3
from datetime import datetime
from typing import Dict, Optional, Union
import json
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('LeadFlowBot')

class LeadFlowBot:
    def __init__(self, db_path: str = 'leads.db'):
        """Inicializa el bot con conexión a la base de datos.
        
        Args:
            db_path (str): Ruta al archivo de base de datos SQLite
        """
        self.conn = self._init_db(db_path)
        self.current_campaign = None
        
        logger.info("LeadFlowBot inicializado correctamente")

    def _init_db(self, db_path: str) -> sqlite3.Connection:
        """Inicializa la base de datos con las tablas necesarias.
        
        Args:
            db_path (str): Ruta al archivo de la base de datos
            
        Returns:
            sqlite3.Connection: Conexión a la base de datos
        """
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Tabla de leads
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT NOT NULL UNIQUE,
            name TEXT,
            email TEXT,
            status TEXT DEFAULT 'new',
            source TEXT DEFAULT 'organic',
            campaign TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_contact TIMESTAMP,
            metadata TEXT
        )
        ''')
        
        # Tabla de interacciones
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_id INTEGER NOT NULL,
            interaction_type TEXT NOT NULL,
            content TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (lead_id) REFERENCES leads (id)
        )
        ''')
        
        conn.commit()
        logger.info("Base de datos inicializada")
        return conn

    def add_lead(
        self,
        phone: str,
        name: Optional[str] = None,
        email: Optional[str] = None,
        source: str = 'organic',
        metadata: Optional[Dict] = None
    ) -> bool:
        """Añade un nuevo lead a la base de datos.
        
        Args:
            phone (str): Número de teléfono (identificador único)
            name (str, optional): Nombre del lead
            email (str, optional): Email del lead
            source (str): Fuente del lead
            metadata (dict, optional): Metadatos adicionales
            
        Returns:
            bool: True si se añadió correctamente, False si hubo error
        """
        try:
            cursor = self.conn.cursor()
            
            # Insertar el lead
            cursor.execute('''
            INSERT INTO leads (phone, name, email, source, campaign, last_contact, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(phone) DO UPDATE SET
                name = excluded.name,
                email = excluded.email,
                last_contact = excluded.last_contact,
                metadata = excluded.metadata
            ''', (
                phone,
                name,
                email,
                source,
                self.current_campaign,
                datetime.now(),
                json.dumps(metadata) if metadata else None
            ))
            
            self.conn.commit()
            
            if cursor.rowcount > 0:
                lead_id = cursor.lastrowid
                logger.info(f"Nuevo lead añadido: ID {lead_id}, Teléfono {phone}")
                self._log_interaction(lead_id, 'lead_added', 'Lead añadido al sistema')
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error añadiendo lead: {str(e)}")
            return False

    def _log_interaction(
        self,
        lead_id: int,
        interaction_type: str,
        content: Optional[str] = None
    ) -> bool:
        """Registra una interacción con un lead.
        
        Args:
            lead_id (int): ID del lead
            interaction_type (str): Tipo de interacción
            content (str, optional): Contenido o detalles
            
        Returns:
            bool: True si se registró correctamente
        """
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
            INSERT INTO interactions (lead_id, interaction_type, content)
            VALUES (?, ?, ?)
            ''', (lead_id, interaction_type, content))
            
            # Actualizar last_contact en la tabla leads
            cursor.execute('''
            UPDATE leads SET last_contact = ? WHERE id = ?
            ''', (datetime.now(), lead_id))
            
            self.conn.commit()
            return True
        except Exception as e:
            logger.error(f"Error registrando interacción: {str(e)}")
            return False

    def set_campaign(self, campaign_name: str) -> None:
        """Establece la campaña actual para nuevos leads.
        
        Args:
            campaign_name (str): Nombre de la campaña
        """
        self.current_campaign = campaign_name
        logger.info(f"Campaña establecida: {campaign_name}")

    def get_lead(self, phone: str) -> Optional[Dict]:
        """Obtiene información de un lead por su teléfono.
        
        Args:
            phone (str): Número de teléfono del lead
            
        Returns:
            dict: Diccionario con la información del lead o None si no existe
        """
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
            SELECT id, phone, name, email, status, source, campaign, created_at, last_contact, metadata
            FROM leads WHERE phone = ?
            ''', (phone,))
            
            lead = cursor.fetchone()
            if lead:
                return {
                    'id': lead[0],
                    'phone': lead[1],
                    'name': lead[2],
                    'email': lead[3],
                    'status': lead[4],
                    'source': lead[5],
                    'campaign': lead[6],
                    'created_at': lead[7],
                    'last_contact': lead[8],
                    'metadata': json.loads(lead[9]) if lead[9] else None
                }
            return None
        except Exception as e:
            logger.error(f"Error obteniendo lead: {str(e)}")
            return None

    def close(self) -> None:
        """Cierra la conexión a la base de datos."""
        self.conn.close()
        logger.info("Conexión a la base de datos cerrada")


# Ejemplo de uso
if __name__ == '__main__':
    bot = LeadFlowBot()
    
    # Añadir un lead de prueba
    bot.add_lead(
        phone="+1234567890",
        name="Ejemplo Lead",
        email="lead@example.com",
        source="web",
        metadata={"pagina_visitada": "/producto-1"}
    )
    
    # Obtener el lead
    lead = bot.get_lead("+1234567890")
    print("Lead obtenido:", lead)
    
    bot.close()
