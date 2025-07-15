CREATE TABLE daily_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    score_date DATE NOT NULL,
    scores JSONB,
    total_score DECIMAL,
    checklist_completed INTEGER DEFAULT 0,
    total_checklist_items INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);