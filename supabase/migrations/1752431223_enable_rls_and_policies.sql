-- Migration: enable_rls_and_policies
-- Created at: 1752431223

-- Enable RLS on all tables
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for trades table
CREATE POLICY "Users can view their own trades" ON trades
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades" ON trades
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" ON trades
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades" ON trades
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for daily_scores table
CREATE POLICY "Users can view their own daily scores" ON daily_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily scores" ON daily_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily scores" ON daily_scores
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily scores" ON daily_scores
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for insights table
CREATE POLICY "Users can view their own insights" ON insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights" ON insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" ON insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights" ON insights
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for market_data table
CREATE POLICY "Users can view their own market data" ON market_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own market data" ON market_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own market data" ON market_data
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own market data" ON market_data
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_settings table
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON user_settings
    FOR DELETE USING (auth.uid() = user_id);;