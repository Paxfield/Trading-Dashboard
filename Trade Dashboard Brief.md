
Create a trading dashboard with a custom layout. The home screen will display a grid of cards, tabs and two buttons to upload trading related data.  

Some cards will contain embeds, URL's, iframes and/or an AI chat. While other cards will allow a user to input text based on questions which will automatically store to either a custom "positions" spreadsheet journal or a separate "insights" database/spreadsheet depending on the cards label. Cards with input/text capability are cleared at the end of each day after the data has been captured for fresh input the following day.  

The goal of these cards are to help build a macro and intraday narrative to determine high probability trading conditions and best positioning for my models and strategy.   

Grid Cards: 

*AI chat based:  

1. COT Analyst Agent  
    
    - Provide a Bias and sentiment for the upcoming week ahead based on the users commodity selection. Also add market implications to the analysis.   
        
2. News Agent  
    
    - Automatically display positioning analysis for the week based on 1. which days do and do not have high impact news 2. summary or insights from the Event Calendar. No need for Market sentiment or recommendations. I should also be able to chat with the agent for additional insight.   
        

*With Input capability:  

3. Sunday:  
    
    - Review markets for MACRO (Quarterly, Monthly, Weekly) close 

    - Are old highs/lows being respected?  

    - Are Gaps being respected? 

    - What are closures and structure suggesting?  

    - Mark out MACRO levels 

    - Align Calendar events with overall macro picture  

    - Note any economic narratives and how they might affect the market and your bias 

    - Identify which participants are flowing in/out of which markets  

    - What is COT suggesting?  

    - What are internals suggesting?  

    - Identify MACRO bias and positioning for the week 
        
    
4. Pre-market game plan:  
    
    - Review markets for Daily close 
        
    - Are old highs/lows being respected?  
        
    - Are Gaps being respected? 
        
    - What are closures and structure suggesting?  
        
    - Mark out HTF levels 
        
    - Identify Daily Bias 
        
    - Review calendar for events  
        
    - Identify intraday levels where a setup might form 
        
    - Review how price has reacted to news  
        
    - Has price been running through or testing model points? 
        
    
5. Trading session plan   
    
    - Mindest first  
        
    - Is volume mid-high? Is volatility high or normal?  
        
        - If volume participation is low, no trading until picks up 
            
        - If volatility high, wider stops and reduced size 
            
    - Is price trading above or below midnight and the open? 
        
        - If not, I will avoid until we do 
            
        - If yes, I will look for price signatures or confluence supports my daily bias  
            
            - I IGNORE ALL SIGNATURES IN PRICE THAT DO NOT ALIGN WITH DAILY BIAS 
                
    - What are the correlations?  
        
    - What’s the plan and how do I position for today?  
        
    - Execute trades using one of the following methods: 
        
        - Responsive FVG or IFVG 
            
        - MSST 
            
        - OTE 
            
        - Failure close 
            
    - Capturing execution data in real-time  
        
        - Symbol, stop, target, entry class 
            
        - Variables in setup  
            
        - How I feel about the trade 
            
        - How I managed the trade  
            

6. Review  
    
    - Review of each execution 
        
    - Things I did well, Things I did poorly (Mapped against: Impulse management and data collection – art & science)  
        
    - Focus for tomorrow  
        
    
7. Daily Score: 
    
    - Meditated? 
        
    - Planned for trade?  
        
    - Executed to plan?  
        
    - Narrated out loud?  
        
    - Minimized screentime?  
        
    - Collected end of day data?  
        

Databases:  

The Positions Journal will receive data from 2 sources. #1 An uploaded excel spreadsheet from the broker (Tradovate) containing trade position information and #2. Data from these input cards; Pre-market game plan, Trading session plan. Here are the specific Positions journal columns: qty  * buyPrice  * sellPrice  * pnl  * boughtTimestamp  * soldTimestamp  * duration  * bias  * commodity * stop  * target  * entry class  * execution model  * variables used  * loss/win  * percent return  * $ risk  * risk to reward. For clarity, entry class means; How was my entry? Attacked, late or pocket.   

The only data that should flow from the input cards to the Positions Journal are: symbol • stop • target • entry class • variables in setup. "Variables" for the variables in setup will be pulled from an additional knowledge base of specific keywords.  

All other data from input cards should be stored in an insights knowledge base.  

Variables list:  

- Forex factory calendar for market event data 
    
- Trending market  
    
- HTF (1H-1 week) Gaps  
    
- Bank Levels  
    
- Multi-buy/sell touch levels  
    
- London, Asia, Liquidity (highs and lows) 
    
- HTF (1H-3 month) Liquidity 
    
- 15m-Daily tall wick and close through level 
    
- 15m-Daily Volatile failure and close through level 
    
- 5m-15m Inversion and close (Minimum 2 ticks) through level 
    
- 1H-3 Month structure shift 
    
- 15m-Day SMT Divergence (High and low correlation divergence)  
    
- NQ leading or lagging (divergence with RTY, ES, YM Futures)  
    
- Dollar to Future Indices correlation  
    
- TICK weight (Control) 
    
- Midnight open  
    
- Day open  
    
- Week open 
    
- Gap respect 
    
- 1h - Day Swing points  
    
- Cumulative Volume  
    
- Asia range STD  
    
- COT  
    
- First Green/Red day print (Heiken-ashi candles)  
    
- Open-interest  
    
- Multi-timeframe bias alignment  
    
- Multi-timeframe liquidity sweep  
    
- Multi-timeframe gaps/FVG 
    
- MOVE index 
    
- M2 money supply  
    
- VTI (Total stock market) direction  
    
- MCI (Global stock market) direction  
    
- LEI 
    
- Day, week, month, 3 month high and low  
    
- 50% EQ (equilibrium)  
    
- 50-62% OTE  
    
- 50% of gap/FVG 
    
- 3rd candle gap formation:  
    
    - Consolidation  
        
    - Expansion  
        

*Execution models: 

- Responsive FVG or IFVG 
    
- MSST (Structure shift and test) 
    
- OTE (Swing point standard deviations)  
    
- Failure Close (Responsive failure back through a level with strong close)  
    

*Key: For reference

- M = minutes  
    
- H = hours  
    
- STD = Standard deviations  

- Class = Attacked, Pocket, Missed, Behind 
    

Tabs: 

1. Dashboard

2. Positions 
    
3. Event Calendar  
    
3. Performance  
    
    1. Tradovate performance summary mimic  
        
4. Data reflection  
    
    1. Daily Score 
        
    2. Summary of key Insights from data capture 
        
    3. AI chat functionality 
        

Buttons: 

1. Upload for Positions Journal  
    
    1. Excel or CSV from Tradovate  
        
2. Upload for data collection  
    
    1. Screenshots or images of trading sessions and models/strategy 
        
    2. Documentation for models/strategy