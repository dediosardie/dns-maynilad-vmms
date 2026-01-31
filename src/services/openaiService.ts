// AI-Driven Analysis Service using GitHub AI Models
// Compatible with GitHub Copilot subscription
import { FuelTransaction, Vehicle, Driver } from '../types';

interface FuelEfficiencyAnalysis {
  summary: string;
  insights: string[];
  recommendations: string[];
  costTrends: string;
  efficiencyScore: number;
  anomalies: string[];
}

class OpenAIService {
  private apiKey: string;
  // GitHub AI Models endpoint (compatible with Copilot subscription)
  private apiUrl = 'https://models.inference.ai.azure.com/chat/completions';
  // Using GPT-4o model through GitHub AI Models
  private model = 'gpt-4o';

  constructor() {
    // Get GitHub token from environment variable or localStorage
    this.apiKey = import.meta.env.VITE_GITHUB_TOKEN || localStorage.getItem('github_token') || '';
  }

  /**
   * Set the GitHub token for AI Models
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('github_token', apiKey);
  }

  /**
   * Check if GitHub token is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Analyze fuel efficiency using GPT-4o through GitHub AI Models
   */
  async analyzeFuelEfficiency(
    transactions: FuelTransaction[],
    vehicles: Vehicle[],
    drivers: Driver[]
  ): Promise<FuelEfficiencyAnalysis> {
    if (!this.isConfigured()) {
      throw new Error('GitHub token is not configured. Please set your GitHub token first.');
    }

    // Prepare data summary for AI analysis
    const dataSummary = this.prepareFuelDataSummary(transactions, vehicles, drivers);

    const prompt = `You are a fleet management AI analyst. Analyze the following fuel transaction data and provide insights:

${dataSummary}

Please provide a comprehensive analysis in the following JSON format:
{
  "summary": "Brief overview of fuel usage patterns (2-3 sentences)",
  "insights": ["Key insight 1", "Key insight 2", "Key insight 3"],
  "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2", "Actionable recommendation 3"],
  "costTrends": "Analysis of cost trends and patterns",
  "efficiencyScore": 75, // Score from 0-100 based on efficiency
  "anomalies": ["Any unusual patterns or outliers detected"]
}

Focus on:
1. Cost efficiency and trends
2. Fuel consumption patterns
3. Vehicle-specific insights
4. Driver behavior patterns (if applicable)
5. Potential cost savings opportunities
6. Unusual patterns or anomalies

Provide actionable, data-driven recommendations.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert fleet management analyst specializing in fuel efficiency optimization. Provide clear, actionable insights based on data analysis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to analyze fuel efficiency');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const analysis: FuelEfficiencyAnalysis = JSON.parse(content);

      return analysis;
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
  }

  /**
   * Prepare fuel data summary for AI analysis
   */
  private prepareFuelDataSummary(
    transactions: FuelTransaction[],
    vehicles: Vehicle[],
    drivers: Driver[]
  ): string {
    const totalTransactions = transactions.length;
    const totalLiters = transactions.reduce((sum, t) => sum + t.liters, 0);
    const totalCost = transactions.reduce((sum, t) => sum + t.cost, 0);
    const avgCostPerLiter = totalLiters > 0 ? totalCost / totalLiters : 0;

    // Calculate per-vehicle statistics
    const vehicleStats = vehicles.map(vehicle => {
      const vehicleTxns = transactions.filter(t => t.vehicle_id === vehicle.id);
      const liters = vehicleTxns.reduce((sum, t) => sum + t.liters, 0);
      const cost = vehicleTxns.reduce((sum, t) => sum + t.cost, 0);
      return {
        vehicle: `${vehicle.make} ${vehicle.model} (${vehicle.plate_number})`,
        transactions: vehicleTxns.length,
        liters: liters.toFixed(2),
        cost: cost.toFixed(2),
        avgCostPerLiter: liters > 0 ? (cost / liters).toFixed(2) : '0'
      };
    }).filter(v => v.transactions > 0);

    // Calculate per-driver statistics (if available)
    const driverStats = drivers.map(driver => {
      const driverTxns = transactions.filter(t => t.driver_id === driver.id);
      const liters = driverTxns.reduce((sum, t) => sum + t.liters, 0);
      const cost = driverTxns.reduce((sum, t) => sum + t.cost, 0);
      return {
        driver: driver.full_name,
        transactions: driverTxns.length,
        liters: liters.toFixed(2),
        cost: cost.toFixed(2)
      };
    }).filter(d => d.transactions > 0);

    // Recent transactions (last 10)
    const recentTransactions = transactions
      .slice(0, 10)
      .map(t => {
        const vehicle = vehicles.find(v => v.id === t.vehicle_id);
        const driver = drivers.find(d => d.id === t.driver_id);
        return {
          date: new Date(t.transaction_date).toLocaleDateString(),
          vehicle: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown',
          driver: driver?.full_name || 'Unknown',
          liters: t.liters.toFixed(2),
          cost: t.cost.toFixed(2),
          costPerLiter: t.cost_per_liter.toFixed(2)
        };
      });

    return `
FLEET FUEL CONSUMPTION OVERVIEW:
- Total Transactions: ${totalTransactions}
- Total Fuel Consumed: ${totalLiters.toFixed(2)} liters
- Total Cost: Php ${totalCost.toFixed(2)}
- Average Cost per Liter: Php ${avgCostPerLiter.toFixed(2)}
- Total Vehicles: ${vehicles.length}
- Active Drivers: ${drivers.filter(d => d.status === 'active').length}

VEHICLE-SPECIFIC STATISTICS:
${vehicleStats.map(v => `- ${v.vehicle}: ${v.transactions} transactions, ${v.liters}L, Php ${v.cost} total, Php ${v.avgCostPerLiter}/L avg`).join('\n')}

DRIVER-SPECIFIC STATISTICS:
${driverStats.length > 0 ? driverStats.map(d => `- ${d.driver}: ${d.transactions} transactions, ${d.liters}L, Php ${d.cost}`).join('\n') : 'No driver data available'}

RECENT TRANSACTIONS (Last 10):
${recentTransactions.map((t, i) => `${i + 1}. ${t.date} - ${t.vehicle} (${t.driver}): ${t.liters}L @ Php ${t.costPerLiter}/L = Php ${t.cost}`).join('\n')}
`;
  }
}

export const openaiService = new OpenAIService();
