
export type Cycle = {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  cycle_length: number;
};

export type Prediction = {
  user_id: number;
  last_period: string;
  next_period: string;
  ovulation_date: string;
  error?: string;
};

export type Mood = { id: number; user_id: number; mood: string; note: string };
export type Symptom = { id: number; user_id: number; symptom: string; severity: string };
export type Reminder = { id: number; user_id: number; type: string; reminder_time: string };

export type Dashboard = {
  user_id?: number;
  last_period?: string | null;
  next_period?: string | null;
  ovulation_date?: string | null;
  cycle_length?: number | null;
  latest_mood?: string | null;
  latest_note?: string | null;
  latest_symptom?: string | null;
  symptom_severity?: string | null;
  error?: string;
};

export type Analytics = {
  average_cycle: number;
  average_period: number;
  most_common_mood: string | null;
  total_records: number;
};
