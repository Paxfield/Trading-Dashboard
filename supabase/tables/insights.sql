CREATE TABLE insights (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    insight_type TEXT NOT NULL,
    title TEXT,
    content TEXT,
    data JSONB,
    filename TEXT,
    file_type TEXT,
    file_size BIGINT,
    insight_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);