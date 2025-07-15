CREATE TABLE user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,
    preferences JSONB DEFAULT '{}',
    dashboard_config JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    timezone TEXT DEFAULT 'UTC',
    theme TEXT DEFAULT 'dark',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);