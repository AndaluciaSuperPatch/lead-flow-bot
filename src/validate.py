https://github.com/AndaluciaSuperPatch/lead-flow-bot-valid/blob/main/scripts/python-m py_compile validate.py
def validate_lead(lead_data: dict) -> bool:
    """Valida que el lead tenga los campos obligatorios."""
    required_fields = ["name", "email", "phone"]
    return all(field in lead_data for field in required_fields)

if __name__ == "__main__":
    test_lead = {"name": "Test", "email": "test@example.com", "phone": "123456789"}
    print("Lead válido?" validate_lead(test_lead))
