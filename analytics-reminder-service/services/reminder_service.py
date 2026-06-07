from datetime import datetime


# validasi format jam (HH:MM)
def validate_time_format(time_str: str):
    try:
        datetime.strptime(time_str, "%H:%M")
        return True
    except ValueError:
        return False


# grouping reminder per user
def group_reminders(reminders):
    grouped = {}

    for r in reminders:
        user_id = r.user_id

        if user_id not in grouped:
            grouped[user_id] = []

        grouped[user_id].append({
            "type": r.type,
            "time": r.reminder_time
        })

    return grouped


# generate reminder otomatis sederhana (rule-based)
def generate_default_reminders(user_id: int):
    return [
        {
            "user_id": user_id,
            "type": "drink_water",
            "reminder_time": "08:00"
        },
        {
            "user_id": user_id,
            "type": "sleep",
            "reminder_time": "22:00"
        },
        {
            "user_id": user_id,
            "type": "exercise",
            "reminder_time": "17:00"
        }
    ]