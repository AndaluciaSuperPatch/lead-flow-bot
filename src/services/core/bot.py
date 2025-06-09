import sqlite3
import re
import json
import logging
from datetime import datetime
from typing import Dict, Optional

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('LeadFlowBot')

def is_valid_email(email: str) -> bool:
    return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

def is_valid_phone(phone: str) -> bool:
    return re.match(r"^\+?[0-9]{9,15}$", phone) is not None

class LeadFlowBot:
    def __init__(self, db_path: str = 'leads.db'):
        self.conn = self._init_db(db_path)
        self.current_campaign = None
        logger.info("LeadFlowBot inicializado correctamente")

    def _init_db(self, db_path: str) -> sqlite3.Connection:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT NOT NULL UNIQUE,
            name TEXT,
            email TEXT,
            status TEXT DEFAULT 'new',
            source TEXT DEFAULT 'organic',
            campaign TEXT,
            consent BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_contact TIMESTAMP,
            metadata TEXT
        )
        ''')

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

    def add_lead(self, phone: str, name: Optional[str] = None, email: Optional[str] = None,
                 source: str = 'organic', metadata: Optional[Dict] = None, consent: bool = False) -> bool:
        if not is_valid_phone(phone):
            logger.warning(f"Teléfono inválido: {phone}")
            return False

        if email and not is_valid_email(email):
            logger.warning(f"Email inválido: {email}")
            return False

        if not consent:
            logger.warning(f"Lead rechazado por falta de consentimiento: {phone}")
            return False

        try:
            cursor = self.conn.cursor()
            cursor.execute('''
            INSERT INTO leads (phone, name, email, source, campaign, last_contact, metadata, consent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(phone) DO UPDATE SET
                name = excluded.name,
                email = excluded.email,
                last_contact = excluded.last_contact,
                metadata = excluded.metadata,
                consent = excluded.consent
            ''', (
                phone, name, email, source, self.current_campaign, datetime.now(),
                json.dumps(metadata) if metadata else None, int(consent)
            ))
            self.conn.commit()
            lead_id = cursor.lastrowid
            logger.info(f"Lead añadido o actualizado: {phone}")
            self._log_interaction(lead_id, 'lead_added', 'Lead añadido al sistema')
            return True
        except Exception as e:
            logger.error(f"Error añadiendo lead: {str(e)}")
            return False

    def _log_interaction(self, lead_id: int, interaction_type: str, content: Optional[str] = None) -> bool:
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
            INSERT INTO interactions (lead_id, interaction_type, content)
            VALUES (?, ?, ?)
            ''', (lead_id, interaction_type, content))
            cursor.execute('''
            UPDATE leads SET last_contact = ? WHERE id = ?
            ''', (datetime.now(), lead_id))
            self.conn.commit()
            return True
        except Exception as e:
            logger.error(f"Error registrando interacción: {str(e)}")
            return False

    def set_campaign(self, campaign_name: str) -> None:
        self.current_campaign = campaign_name
        logger.info(f"Campaña establecida: {campaign_name}")

    def get_lead(self, phone: str) -> Optional[Dict]:
        try:
            cursor = self.conn.cursor()
            cursor.execute('''
            SELECT id, phone, name, email, status, source, campaign, consent, created_at, last_contact, metadata
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
                    'consent': bool(lead[7]),
                    'created_at': lead[8],
                    'last_contact': lead[9],
                    'metadata': json.loads(lead[10]) if lead[10] else None
                }
            return None
        except Exception as e:
            logger.error(f"Error obteniendo lead: {str(e)}")
            return None

    def close(self) -> None:
        self.conn.close()
        logger.info("Conexión a la base de datos cerrada")

if __name__ == '__main__':
    bot = LeadFlowBot()
    bot.set_campaign("Lanzamiento Junio 2025")
    bot.add_lead(
        phone="+34654669289",
        name="Fernando Gabaldón",
        email="fgabaldonoliver@gmail.com",
        source="landing_page",
        metadata={"utm_source": "facebook_ads"},
        consent=True
    )
    print(bot.get_lead("+34654669289"))
    bot.close()
