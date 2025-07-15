CREATE TABLE market_data (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    data_type TEXT NOT NULL,
    data_content JSONB,
    market_date DATE,
    symbol TEXT,
    timeframe TEXT,
    analysis_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);