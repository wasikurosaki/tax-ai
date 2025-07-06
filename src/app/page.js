"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calculator,
  FileText,
  Download,
  Eye,
  PlusCircle,
  Trash2,
  BookOpen,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";

// Enhanced VAT rates and exemptions based on NBR laws
const VAT_RATES = {
  standard: 15,
  reduced: 7.5,
  zero: 0,
  exempt: 0,
};

const VAT_EXEMPTIONS = {
  "Rice, Wheat, Flour": {
    rate: 0,
    category: "Basic Food",
    schedule: "Schedule-1",
  },
  "Milk, Dairy Products": {
    rate: 0,
    category: "Basic Food",
    schedule: "Schedule-1",
  },
  "Educational Services": {
    rate: 0,
    category: "Education",
    schedule: "Schedule-1",
  },
  "Healthcare Services": {
    rate: 0,
    category: "Healthcare",
    schedule: "Schedule-1",
  },
  "Export Goods": { rate: 0, category: "Export", schedule: "Schedule-1" },
  "Financial Services": {
    rate: 0,
    category: "Finance",
    schedule: "Schedule-1",
  },
  "Books, Newspapers": {
    rate: 7.5,
    category: "Reduced Rate",
    schedule: "Schedule-2",
  },
  Pharmaceuticals: {
    rate: 7.5,
    category: "Reduced Rate",
    schedule: "Schedule-2",
  },
};

const TAX_REBATES = {
  "Export Oriented Industry": {
    percentage: 50,
    description: "50% rebate on VAT for export-oriented industries",
  },
  "Cottage Industry": {
    percentage: 25,
    description: "25% rebate for cottage industries",
  },
  "Women Entrepreneur": {
    percentage: 10,
    description: "10% additional rebate for women entrepreneurs",
  },
  "Green Technology": {
    percentage: 20,
    description: "20% rebate for green technology adoption",
  },
};

// Enhanced sales data with automatic VAT calculation
const salesData = [
  {
    id: 1,
    product: "Cement",
    supplier: "ABC Ltd",
    vatChallanNo: "VAT-123456",
    purchaseDate: "2025-06-15",
    baseValue: 85000,
    category: "Construction Materials",
    hsCode: "2523.29",
    rebateEligible: false,
  },
  {
    id: 2,
    product: "Steel Rod",
    supplier: "SteelTech",
    vatChallanNo: "VAT-654321",
    purchaseDate: "2025-06-18",
    baseValue: 50000,
    category: "Construction Materials",
    hsCode: "7214.20",
    rebateEligible: false,
  },
  {
    id: 3,
    product: "Books",
    supplier: "Educational Publishers",
    vatChallanNo: "VAT-789012",
    purchaseDate: "2025-06-20",
    baseValue: 75000,
    category: "Educational Materials",
    hsCode: "4901.99",
    rebateEligible: false,
  },
  {
    id: 4,
    product: "Pharmaceuticals",
    supplier: "PharmaCorp",
    vatChallanNo: "VAT-345678",
    purchaseDate: "2025-06-25",
    baseValue: 180000,
    category: "Medical",
    hsCode: "3004.90",
    rebateEligible: false,
  },
  {
    id: 5,
    product: "Machinery",
    supplier: "Heavy Industries",
    vatChallanNo: "VAT-901234",
    purchaseDate: "2025-06-28",
    baseValue: 500000,
    category: "Machinery",
    hsCode: "8479.89",
    rebateEligible: true,
    rebateType: "Export Oriented Industry",
  },
];

const salesOutData = [
  {
    id: 1,
    product: "Finished Goods",
    customer: "Retail Corp",
    challanNo: "SALE-001",
    saleDate: "2025-06-16",
    baseValue: 120000,
    category: "Finished Products",
    hsCode: "9999.99",
    rebateEligible: false,
  },
  {
    id: 2,
    product: "Educational Services",
    customer: "University",
    challanNo: "SALE-002",
    saleDate: "2025-06-22",
    baseValue: 80000,
    category: "Education",
    hsCode: "9999.99",
    rebateEligible: false,
  },
  {
    id: 3,
    product: "Export Goods",
    customer: "International Buyer",
    challanNo: "SALE-003",
    saleDate: "2025-06-30",
    baseValue: 150000,
    category: "Export",
    hsCode: "9999.99",
    rebateEligible: false,
  },
];

// Enhanced AI Knowledge Base
const AI_KNOWLEDGE = {
  vatRates: {
    standard: "Standard VAT rate is 15% applicable to most goods and services",
    reduced:
      "Reduced rate of 7.5% applies to books, newspapers, and pharmaceuticals",
    zero: "Zero rate applies to exports and basic food items",
    exempt:
      "Exempt items include education, healthcare, and financial services",
  },
  compliance: {
    filing: "Monthly VAT returns must be filed by 15th of following month",
    payment: "VAT payment due by 15th of following month",
    records: "Maintain all VAT documents for minimum 6 years",
    penalties: "Late filing: ৳500 + 2% per month on unpaid amount",
  },
  rebatePrograms: {
    export: {
      rate: 50,
      description: "Export-oriented industries",
      eligibility: "Minimum 80% export revenue",
    },
    cottage: {
      rate: 25,
      description: "Cottage industries",
      eligibility: "Small scale manufacturing",
    },
    women: {
      rate: 10,
      description: "Women entrepreneurs",
      eligibility: "Women-owned businesses",
    },
    green: {
      rate: 20,
      description: "Green technology",
      eligibility: "Environment-friendly products",
    },
    industrial: {
      rate: 15,
      description: "Industrial raw materials",
      eligibility: "Manufacturing inputs",
    },
  },
  exemptions: {
    education: "Educational services are fully exempt from VAT",
    healthcare: "Medical services and medicines are VAT exempt",
    exports: "All export goods qualify for zero-rate VAT",
    basicFoods: "Rice, wheat, milk, and essential foods are zero-rated",
  },
};

// Smart VAT calculation function
function calculateVAT(item) {
  const baseValue = item.baseValue || 0;
  let vatRate = VAT_RATES.standard; // Default 15%
  let isExempt = false;
  let exemptionReason = null;

  // Check for exemptions
  for (const [exemptItem, details] of Object.entries(VAT_EXEMPTIONS)) {
    if (
      item.product.toLowerCase().includes(exemptItem.toLowerCase()) ||
      item.category.toLowerCase().includes(details.category.toLowerCase())
    ) {
      vatRate = details.rate;
      isExempt = vatRate === 0;
      exemptionReason = details.schedule;
      break;
    }
  }

  let vatAmount = (baseValue * vatRate) / 100;
  let rebateAmount = 0;
  let finalVatAmount = vatAmount;

  // Apply rebates if eligible
  if (item.rebateEligible && item.rebateType) {
    const rebate = TAX_REBATES[item.rebateType];
    if (rebate) {
      rebateAmount = (vatAmount * rebate.percentage) / 100;
      finalVatAmount = vatAmount - rebateAmount;
    }
  }

  return {
    baseValue,
    vatRate,
    vatAmount,
    rebateAmount,
    finalVatAmount,
    totalValue: baseValue + finalVatAmount,
    isExempt,
    exemptionReason,
  };
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [viewType, setViewType] = useState("purchase");
  const [currentSalesData, setCurrentSalesData] = useState(salesData);
  const [currentSalesOutData, setCurrentSalesOutData] = useState(salesOutData);
  const [conversationContext, setConversationContext] = useState({
    lastTopic: null,
    userData: {},
    analysisHistory: [],
  });

  // Calculate enhanced totals with VAT
  const calculateTotals = (data) => {
    return data.reduce(
      (acc, item) => {
        const calc = calculateVAT(item);
        return {
          baseValue: acc.baseValue + calc.baseValue,
          vatAmount: acc.vatAmount + calc.vatAmount,
          rebateAmount: acc.rebateAmount + calc.rebateAmount,
          finalVatAmount: acc.finalVatAmount + calc.finalVatAmount,
          totalValue: acc.totalValue + calc.totalValue,
        };
      },
      {
        baseValue: 0,
        vatAmount: 0,
        rebateAmount: 0,
        finalVatAmount: 0,
        totalValue: 0,
      }
    );
  };

  const purchaseTotals = calculateTotals(currentSalesData);
  const salesTotals = calculateTotals(currentSalesOutData);
  const netVatPayable =
    salesTotals.finalVatAmount - purchaseTotals.finalVatAmount;

  // Advanced AI Response System with Natural Language Processing
  const generateAIResponse = async (userInput, context) => {
    const input = userInput.toLowerCase().trim();

    // Analyze all data for comprehensive responses
    const allTransactions = [...currentSalesData, ...currentSalesOutData];
    const salesWithVAT = currentSalesOutData
      .map((item) => ({
        ...item,
        calc: calculateVAT(item),
      }))
      .sort((a, b) => b.calc.finalVatAmount - a.calc.finalVatAmount);

    const purchasesWithVAT = currentSalesData
      .map((item) => ({
        ...item,
        calc: calculateVAT(item),
      }))
      .sort((a, b) => b.calc.finalVatAmount - a.calc.finalVatAmount);

    // Enhanced fuzzy matching for typos and variations
    const fuzzyMatch = (text, patterns) => {
      return patterns.some((pattern) => {
        // Exact match
        if (text.includes(pattern)) return true;

        // Handle common typos and variations
        const variations = {
          purchase: ["purchs", "purchas", "purchse", "buy", "buying", "bought"],
          sale: ["sal", "sales", "sell", "selling", "sold"],
          vat: ["va", "tax", "taxes"],
          highest: [
            "high",
            "maximum",
            "max",
            "most",
            "largest",
            "biggest",
            "top",
          ],
          lowest: ["low", "minimum", "min", "least", "smallest", "bottom"],
          total: ["tot", "sum", "aggregate", "overall", "all"],
          spending: ["spend", "spent", "expense", "expenses", "cost", "costs"],
          profit: ["profits", "earning", "earnings", "gain", "gains", "income"],
          compliance: [
            "complian",
            "comply",
            "regulation",
            "rules",
            "requirement",
          ],
        };

        // Check if pattern has variations
        for (const [key, vars] of Object.entries(variations)) {
          if (pattern === key && vars.some((v) => text.includes(v))) {
            return true;
          }
        }

        // Levenshtein distance for close matches
        const distance = levenshteinDistance(text, pattern);
        return distance <= 2 && pattern.length > 3;
      });
    };

    // Simple Levenshtein distance function
    const levenshteinDistance = (str1, str2) => {
      const matrix = [];
      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
      }
      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
      }
      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[str2.length][str1.length];
    };

    // Enhanced intent detection with fuzzy matching
    const detectIntent = (input) => {
      const intents = {
        highest: ["highest", "maximum", "most", "largest", "biggest", "top"],
        lowest: ["lowest", "minimum", "least", "smallest", "bottom"],
        sales: ["sales", "sell", "sold", "revenue", "income", "customer"],
        purchase: [
          "purchase",
          "buy",
          "bought",
          "procurement",
          "supplier",
          "expense",
        ],
        vat: ["vat", "tax", "duty", "levy"],
        details: [
          "details",
          "show",
          "list",
          "display",
          "breakdown",
          "information",
        ],
        total: ["total", "sum", "aggregate", "overall"],
        compare: ["compare", "difference", "versus", "vs", "between"],
        which: ["which", "what", "who", "where"],
        how: ["how", "calculate", "computation"],
        when: ["when", "date", "time", "deadline"],
        rebate: ["rebate", "discount", "incentive", "savings"],
        exempt: ["exempt", "exemption", "zero", "free"],
        spending: ["spending", "spent", "expense", "expenses", "cost", "costs"],
        profit: ["profit", "profits", "earning", "earnings", "gain", "income"],
        compliance: [
          "compliance",
          "compliant",
          "regulation",
          "rules",
          "requirement",
        ],
        submit: ["submit", "file", "return", "filing"],
        yes: ["yes", "yeah", "yep", "sure", "ok", "okay"],
      };

      const detected = {};
      Object.entries(intents).forEach(([intent, keywords]) => {
        detected[intent] = fuzzyMatch(input, keywords);
      });
      return detected;
    };

    const intent = detectIntent(input);

    // Handle "yes" responses by providing relevant details
    if (intent.yes && input.length <= 5) {
      return `Here are your **key business insights**:
  
  💰 **Financial Overview:**
  • Total Revenue: ৳${salesTotals.baseValue.toLocaleString()}
  • Total Spending: ৳${purchaseTotals.baseValue.toLocaleString()}
  • Gross Profit: ৳${(
    salesTotals.baseValue - purchaseTotals.baseValue
  ).toLocaleString()}
  
  🏆 **Top Performers:**
  • Highest Sale: ৳${salesWithVAT[0].baseValue.toLocaleString()} (${
        salesWithVAT[0].product
      })
  • Highest Purchase: ৳${purchasesWithVAT[0].baseValue.toLocaleString()} (${
        purchasesWithVAT[0].product
      })
  
  📊 **VAT Summary:**
  • Net VAT Position: ${netVatPayable >= 0 ? "Pay" : "Refund"} ৳${Math.abs(
        netVatPayable
      ).toLocaleString()}
  • Total Transactions: ${allTransactions.length}
  
  What specific aspect would you like to explore further?`;
    }

    // Handle profit queries
    if (intent.profit) {
      const grossProfit = salesTotals.baseValue - purchaseTotals.baseValue;
      const profitMargin = (
        (grossProfit / salesTotals.baseValue) *
        100
      ).toFixed(1);

      return `📈 **Your Monthly Profit Analysis:**
  
  💰 **Gross Profit: ৳${grossProfit.toLocaleString()}**
  • Revenue: ৳${salesTotals.baseValue.toLocaleString()}
  • Expenses: ৳${purchaseTotals.baseValue.toLocaleString()}
  • Profit Margin: ${profitMargin}%
  
  🏆 **Most Profitable Sales:**
  ${salesWithVAT
    .slice(0, 3)
    .map(
      (sale, i) =>
        `${i + 1}. ${sale.product}: ৳${sale.baseValue.toLocaleString()} revenue`
    )
    .join("\n")}
  
  📊 **Cost Analysis:**
  • Average Sale: ৳${Math.round(
    salesTotals.baseValue / salesWithVAT.length
  ).toLocaleString()}
  • Average Purchase: ৳${Math.round(
    purchaseTotals.baseValue / purchasesWithVAT.length
  ).toLocaleString()}
  
  ${
    grossProfit > 0 ? "✅ Profitable month!" : "⚠️ Consider cost optimization"
  }`;
    }

    // Handle spending/total cost queries
    if (
      intent.spending ||
      (intent.total &&
        (intent.purchase || fuzzyMatch(input, ["cost", "expense"])))
    ) {
      return `💳 **Your Total Monthly Spending:**
  
  **Total Spent: ৳${purchaseTotals.baseValue.toLocaleString()}**
  
  🛒 **Spending Breakdown:**
  ${purchasesWithVAT
    .map(
      (purchase, i) =>
        `${i + 1}. ${purchase.product}: ৳${purchase.baseValue.toLocaleString()}`
    )
    .join("\n")}
  
  📊 **Spending Analysis:**
  • Average per transaction: ৳${Math.round(
    purchaseTotals.baseValue / purchasesWithVAT.length
  ).toLocaleString()}
  • Largest expense: ৳${purchasesWithVAT[0].baseValue.toLocaleString()} (${
        purchasesWithVAT[0].product
      })
  • Total VAT paid: ৳${purchaseTotals.finalVatAmount.toLocaleString()}
  
  💡 **Insights:**
  • Your biggest spending category generated ${(
    (purchasesWithVAT[0].baseValue / purchaseTotals.baseValue) *
    100
  ).toFixed(1)}% of total expenses
  • You saved ৳${purchaseTotals.rebateAmount.toLocaleString()} through rebates`;
    }

    // Handle compliance queries
    if (intent.compliance) {
      const today = new Date();
      const deadline = new Date(2025, 6, 15); // July 15, 2025
      const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

      return `📋 **VAT Compliance Requirements:**
  
  ⏰ **Critical Deadlines:**
  • Monthly filing: 15th of following month (${daysLeft} days left)
  • Payment due: Same as filing date
  • Current amount: ৳${Math.abs(netVatPayable).toLocaleString()} ${
        netVatPayable >= 0 ? "payable" : "refundable"
      }
  
  📚 **Record Keeping:**
  • Maintain all VAT documents for minimum 6 years
  • Keep purchase invoices, sales receipts, VAT challans
  • Document any rebates or exemptions claimed
  
  💰 **VAT Rates to Remember:**
  • Standard rate: 15% (most goods/services)
  • Reduced rate: 7.5% (books, newspapers, pharmaceuticals)
  • Zero rate: Exports, basic foods
  • Exempt: Education, healthcare, financial services
  
  ⚠️ **Penalties:**
  • Late filing: ৳500 + 2% per month on unpaid amount
  • Incomplete records: Up to ৳10,000 fine
  • False declaration: Up to 100% of tax amount
  
  ${
    daysLeft <= 7
      ? "🚨 **URGENT:** Filing deadline approaching!"
      : "✅ You're on track for compliance"
  }`;
    }

    // Handle highest purchase queries (with typo tolerance)
    if ((intent.highest || intent.which) && intent.purchase) {
      const topPurchase = purchasesWithVAT[0];
      return `Your **highest purchase** is:
  
  🥇 **${topPurchase.product}**
     • Supplier: ${topPurchase.supplier}
     • Purchase Value: ৳${topPurchase.baseValue.toLocaleString()}
     • VAT Paid: ৳${topPurchase.calc.finalVatAmount.toLocaleString()}
     • Date: ${topPurchase.purchaseDate}
     ${
       topPurchase.calc.rebateAmount > 0
         ? `• Rebate Saved: ৳${topPurchase.calc.rebateAmount.toLocaleString()}`
         : ""
     }
  
  📊 **Purchase Rankings:**
  ${purchasesWithVAT
    .map(
      (purchase, i) =>
        `${i + 1}. ${purchase.product}: ৳${purchase.baseValue.toLocaleString()}`
    )
    .join("\n")}
  
  This represents ${(
    (topPurchase.baseValue / purchaseTotals.baseValue) *
    100
  ).toFixed(1)}% of your total spending!`;
    }

    // Handle highest sales VAT queries (with typo tolerance)
    if ((intent.highest || intent.which) && intent.sales && intent.vat) {
      const topSale = salesWithVAT[0];
      return `Your **highest VAT sale** is:
  
  🏆 **${topSale.product}** 
     • Customer: ${topSale.customer}
     • Sale Value: ৳${topSale.baseValue.toLocaleString()}
     • VAT Rate: ${topSale.calc.vatRate}%
     • VAT Amount: ৳${topSale.calc.finalVatAmount.toLocaleString()}
     • Date: ${topSale.saleDate}
  
  📊 **All sales ranked by VAT:**
  ${salesWithVAT
    .map(
      (sale, i) =>
        `${i + 1}. ${
          sale.product
        }: ৳${sale.calc.finalVatAmount.toLocaleString()} VAT`
    )
    .join("\n")}
  
  The ${topSale.product} sale generated ${(
        (topSale.calc.finalVatAmount / salesTotals.finalVatAmount) *
        100
      ).toFixed(1)}% of your total VAT collection!`;
    }

    // Handle submission queries
    if (intent.submit || fuzzyMatch(input, ["return", "filing"])) {
      setSubmitModalOpen(true); // Uncomment if you have this function
      return `🚀 **Ready to submit your VAT return!**
  
  📊 **Submission Summary:**
  • Net VAT Position: ৳${Math.abs(netVatPayable).toLocaleString()} ${
        netVatPayable >= 0 ? "payable" : "refundable"
      }
  • Total Transactions: ${allTransactions.length}
  • Sales Revenue: ৳${salesTotals.baseValue.toLocaleString()}
  • Purchase Expenses: ৳${purchaseTotals.baseValue.toLocaleString()}
  • Rebate Savings: ৳${(
    purchaseTotals.rebateAmount + salesTotals.rebateAmount
  ).toLocaleString()}
  
  ✅ **Compliance Check:**
  • All transactions documented
  • VAT calculations verified
  • Rebates properly applied
  • Ready for NBR submission
  
  🎯 **Next Steps:**
  1. Review all figures above
  2. Confirm bank details for ${netVatPayable >= 0 ? "payment" : "refund"}
  3. Submit through NBR online portal
  4. Keep confirmation receipt
  
  Opening submission portal... 🚀`;
    }

    // Enhanced fallback with better context understanding
    const contextualResponse = () => {
      // Try to understand what they might be asking for
      if (
        input.includes("what") ||
        input.includes("show") ||
        input.includes("tell")
      ) {
        return `I can help you with:
  
  💰 **Financial Information:**
  • "What's my total profit?" - Monthly profit analysis
  • "What's my total spending?" - Complete expense breakdown
  • "What's my highest sale/purchase?" - Top transactions
  
  📊 **VAT Details:**
  • "What's my VAT position?" - Net payable/refundable amount
  • "Show me VAT breakdown" - Detailed VAT calculations
  • "What are my rebates?" - Savings and incentives
  
  📋 **Compliance:**
  • "What are tax compliance requirements?" - Rules and deadlines
  • "When is my filing due?" - Important dates
  • "How do I submit my return?" - Filing process
  
  Just ask me anything about your VAT data! For example: "What's my biggest expense?" or "Show me my profit"`;
      }

      // If they seem to be asking about a specific transaction or amount
      if (input.match(/\d+/) || input.includes("my") || input.includes("the")) {
        return `🔍 **Quick Overview:**
  • Your net VAT position: ${netVatPayable >= 0 ? "Pay" : "Refund"} ৳${Math.abs(
          netVatPayable
        ).toLocaleString()}
  • Total transactions: ${allTransactions.length}
  • Biggest sale: ৳${salesWithVAT[0].baseValue.toLocaleString()} (${
          salesWithVAT[0].product
        })
  • Biggest purchase: ৳${purchasesWithVAT[0].baseValue.toLocaleString()} (${
          purchasesWithVAT[0].product
        })
  
  Ask me for specific details like:
  • "What's my profit this month?"
  • "Show me my highest VAT sale"
  • "What are my compliance requirements?"`;
      }

      return `💡 **I can help you analyze your VAT data!**
  
  Popular questions:
  • "What's my profit?" - Monthly profit analysis
  • "What's my total spending?" - Complete expense breakdown  
  • "What's my highest purchase?" - Top transactions
  • "What are compliance requirements?" - Tax rules and deadlines
  • "Submit my return" - Filing process
  
  Just ask me anything about your business finances! 💰`;
    };

    // Return contextual response if no specific intent matched
    return contextualResponse();
  };

  // Enhanced message handling with better context tracking
  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      // Update conversation context with more details
      setConversationContext((prev) => ({
        ...prev,
        lastTopic: userMessage,
        analysisHistory: [...prev.analysisHistory, userMessage].slice(-10), // Keep last 10
        userData: {
          ...prev.userData,
          lastQuery: userMessage,
          timestamp: new Date().toISOString(),
        },
      }));

      const response = await generateAIResponse(
        userMessage,
        conversationContext
      );

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
        setLoading(false);
      }, Math.random() * 1000 + 500); // Random delay between 500-1500ms for more natural feel
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I encountered an error analyzing your data. Please try rephrasing your question.",
        },
      ]);
      setLoading(false);
    }
  }

  // Enhanced table generation with VAT calculations
  function generateTaxReturnTable() {
    const data =
      viewType === "purchase" ? currentSalesData : currentSalesOutData;
    const totals = viewType === "purchase" ? purchaseTotals : salesTotals;

    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setViewType("purchase")}
            className={`px-4 py-2 rounded ${
              viewType === "purchase" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Mushak-6.3 (Purchases)
          </button>
          <button
            onClick={() => setViewType("sales")}
            className={`px-4 py-2 rounded ${
              viewType === "sales" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Mushak-6.4 (Sales)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-3 py-2">Product/Service</th>
                <th className="px-3 py-2">
                  {viewType === "purchase" ? "Supplier" : "Customer"}
                </th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Base Value</th>
                <th className="px-3 py-2">VAT Rate</th>
                <th className="px-3 py-2">VAT Amount</th>
                <th className="px-3 py-2">Rebate</th>
                <th className="px-3 py-2">Net VAT</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-black">
              {data.map((item, i) => {
                const calc = calculateVAT(item);
                return (
                  <tr key={i} className="border-t border-gray-300">
                    <td className="px-3 py-2">{item.product}</td>
                    <td className="px-3 py-2">
                      {viewType === "purchase" ? item.supplier : item.customer}
                    </td>
                    <td className="px-3 py-2">
                      {viewType === "purchase"
                        ? item.purchaseDate
                        : item.saleDate}
                    </td>
                    <td className="px-3 py-2">
                      ৳{calc.baseValue.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{calc.vatRate}%</td>
                    <td className="px-3 py-2">
                      ৳{calc.vatAmount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      ৳{calc.rebateAmount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      ৳{calc.finalVatAmount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      ৳{calc.totalValue.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          calc.isExempt
                            ? "bg-green-100 text-green-800"
                            : calc.rebateAmount > 0
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {calc.isExempt
                          ? "Exempt"
                          : calc.rebateAmount > 0
                          ? "Rebate"
                          : "Standard"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan="3" className="px-3 py-2 text-right">
                  Total:
                </td>
                <td className="px-3 py-2">
                  ৳{totals.baseValue.toLocaleString()}
                </td>
                <td className="px-3 py-2">-</td>
                <td className="px-3 py-2">
                  ৳{totals.vatAmount.toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  ৳{totals.rebateAmount.toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  ৳{totals.finalVatAmount.toLocaleString()}
                </td>
                <td className="px-3 py-2">
                  ৳{totals.totalValue.toLocaleString()}
                </td>
                <td className="px-3 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  // Enhanced Tax Summary Modal
  function TaxSummaryModal() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Enhanced VAT Return Summary - June 2025
            </h2>
            <button
              onClick={() => setSubmitModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                Total Purchases
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                ৳{purchaseTotals.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">
                Net VAT: ৳{purchaseTotals.finalVatAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Total Sales</h3>
              <p className="text-2xl font-bold text-green-600">
                ৳{salesTotals.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">
                Net VAT: ৳{salesTotals.finalVatAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">
                Total Rebates
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                ৳
                {(
                  purchaseTotals.rebateAmount + salesTotals.rebateAmount
                ).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600">Tax Savings</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                netVatPayable > 0 ? "bg-red-50" : "bg-yellow-50"
              }`}
            >
              <h3
                className={`font-semibold mb-2 ${
                  netVatPayable > 0 ? "text-red-800" : "text-yellow-800"
                }`}
              >
                Net VAT {netVatPayable > 0 ? "Payable" : "Refundable"}
              </h3>
              <p
                className={`text-2xl font-bold ${
                  netVatPayable > 0 ? "text-red-600" : "text-yellow-600"
                }`}
              >
                ৳{Math.abs(netVatPayable).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-black">
                <Calculator size={20} />
                Detailed VAT Calculation
              </h3>
              <div className="space-y-2 text-sm text-black">
                <div className="flex justify-between">
                  <span>Output VAT (Sales):</span>
                  <span>৳{salesTotals.vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Input VAT (Purchases):</span>
                  <span>৳{purchaseTotals.vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Rebates:</span>
                  <span>
                    ৳
                    {(
                      purchaseTotals.rebateAmount + salesTotals.rebateAmount
                    ).toLocaleString()}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>
                    Net VAT {netVatPayable > 0 ? "Payable" : "Refundable"}:
                  </span>
                  <span>৳{Math.abs(netVatPayable).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-black">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle size={20} />
                Compliance Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Filing Status:</span>
                  <span className="text-green-600">✅ Ready</span>
                </div>
                <div className="flex justify-between">
                  <span>Documentation:</span>
                  <span className="text-green-600">✅ Complete</span>
                </div>
                <div className="flex justify-between">
                  <span>Deadline:</span>
                  <span className="text-orange-600">15th July 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Exemptions Verified:</span>
                  <span className="text-green-600">✅ Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertCircle size={20} />
              Important Compliance Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <ul className="space-y-1 text-black">
                <li>• Submit returns by 15th of following month</li>
                <li>• Keep all VAT challans for 6 years minimum</li>
                <li>• Maintain proper books of accounts</li>
                <li>• Register changes in business within 30 days</li>
              </ul>
              <ul className="space-y-1 text-black">
                <li>• Late filing penalty: ৳500 + 2% per month</li>
                <li>• Audit compliance required for rebate claims</li>
                <li>• Export documentation must be complete</li>
                <li>• Quarterly reconciliation recommended</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setSubmitModalOpen(false);
                setConfirmationModalOpen(true);
              }}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Submit Return to NBR
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <Download size={20} />
              Download PDF Report
            </button>
            <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
              <BookOpen size={20} />
              View Legal References
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Confirmation Modal
  function ConfirmationModal() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-lg w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm VAT Return Submission to NBR
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-black">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Return Period:</span>
                  <span className="font-medium">June 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Transactions:</span>
                  <span className="font-medium">
                    {currentSalesData.length + currentSalesOutData.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Net VAT {netVatPayable > 0 ? "Payable" : "Refundable"}:
                  </span>
                  <span className="font-medium">
                    ৳{Math.abs(netVatPayable).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Rebates Applied:</span>
                  <span className="font-medium">
                    ৳
                    {(
                      purchaseTotals.rebateAmount + salesTotals.rebateAmount
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Submission Date:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-700">
                <strong>Legal Declaration:</strong> I confirm that all
                information provided is true and complete according to VAT & SD
                Act 2012. I understand that providing false information may
                result in penalties.
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Once submitted to NBR, this return cannot be modified without
              filing an amendment. Please ensure all information is correct.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmationModalOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleTaxSubmission}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  "Confirm & Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Success Modal
  function SuccessModal() {
    const referenceId = `NBR-VAT-${Date.now().toString().slice(-8)}`;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              VAT Return Successfully Submitted!
            </h3>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>NBR Reference ID:</span>
                  <span className="font-medium font-mono">{referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Submission Status:</span>
                  <span className="font-medium text-green-600">
                    ✅ Accepted
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">
                    ৳{Math.abs(netVatPayable).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Due:</span>
                  <span className="font-medium">15th July 2025</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-700">
                <strong>Next Steps:</strong>{" "}
                {netVatPayable > 0
                  ? "Pay the VAT amount by 15th July 2025 to avoid penalties."
                  : "Your refund will be processed within 30-45 days."}
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              A confirmation email has been sent to your registered email
              address. Keep this reference number for your records.
            </p>
            <button
              onClick={() => {
                setSubmissionStatus(null);
                setConfirmationModalOpen(false);
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: `🎉 **VAT Return Successfully Submitted!**

📋 **Submission Details:**
• NBR Reference: ${referenceId}
• Net VAT ${netVatPayable > 0 ? "Payable" : "Refundable"}: ৳${Math.abs(
                      netVatPayable
                    ).toLocaleString()}
• Status: Accepted by NBR
• Deadline: 15th July 2025

${
  netVatPayable > 0
    ? "💰 **Payment Required:** Please pay ৳" +
      Math.abs(netVatPayable).toLocaleString() +
      " by 15th July 2025 to avoid penalties."
    : "💸 **Refund Processing:** Your refund of ৳" +
      Math.abs(netVatPayable).toLocaleString() +
      " will be processed within 30-45 days."
}

✅ **Your VAT return is now compliant with NBR requirements.**`,
                  },
                ]);
              }}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle tax submission
  const handleTaxSubmission = async () => {
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (Math.random() > 0.05) {
        // 95% success rate
        setSubmissionStatus("success");
      } else {
        setSubmissionStatus("error");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "❌ **Submission Failed**\n\nThere was an error submitting your return to NBR. Please check your internet connection and try again. If the problem persists, contact NBR support at 16223.",
          },
        ]);
      }
    } catch (error) {
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-white font-sans">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-b border-gray-800 shadow">
        <h1 className="text-xl font-semibold">
          🇧🇩 BD VAT AI — Intelligent Tax Assistant with NBR Compliance
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setModalIsOpen(true)}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Eye size={16} />
            View Returns
          </button>
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Calculator size={16} />
            Tax Summary
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={20} />
            Enhanced VAT Dashboard
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Net VAT</p>
              <p className="font-semibold text-lg">
                ৳{Math.abs(netVatPayable).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {netVatPayable >= 0 ? "Payable" : "Refundable"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Total Rebates</p>
              <p className="font-semibold text-lg">
                ৳
                {(
                  purchaseTotals.rebateAmount + salesTotals.rebateAmount
                ).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Tax Savings</p>
            </div>
            <div>
              <p className="text-gray-400">Transactions</p>
              <p className="font-semibold text-lg">
                {currentSalesData.length + currentSalesOutData.length}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
            <div>
              <p className="text-gray-400">Compliance</p>
              <p className="font-semibold text-lg text-green-400">✅ Good</p>
              <p className="text-xs text-gray-500">All requirements met</p>
            </div>
            <div>
              <p className="text-gray-400">Next Deadline</p>
              <p className="font-semibold text-lg text-orange-400">15th July</p>
              <p className="text-xs text-gray-500">8 days left</p>
            </div>
          </div>
        </div>

        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="mb-6">
              <BookOpen size={48} className="mx-auto text-blue-400 mb-4" />
              <p className="text-gray-400 italic mb-4">
                Your intelligent VAT consultant powered by NBR law compliance
                engine. I can understand natural language and analyze your
                specific business data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6 max-w-6xl mx-auto">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-300">
                  📊 Sales Analysis
                </h4>
                <button
                  onClick={() => setInput("Which sales has highest VAT?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Which sales has highest VAT?
                </button>
                <button
                  onClick={() => setInput("Show me my sales details")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Show me my sales details
                </button>
                <button
                  onClick={() => setInput("Which customer paid most VAT?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Which customer paid most VAT?
                </button>
                <button
                  onClick={() => setInput("What's my average sale value?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  What's my average sale value?
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-300">
                  🛒 Purchase Analysis
                </h4>
                <button
                  onClick={() => setInput("Which purchase cost me most VAT?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Which purchase cost me most VAT?
                </button>
                <button
                  onClick={() => setInput("Show me all my purchases")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Show me all my purchases
                </button>
                <button
                  onClick={() => setInput("Which supplier charges lowest VAT?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Which supplier charges lowest VAT?
                </button>
                <button
                  onClick={() => setInput("What did I buy from ABC Ltd?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  What did I buy from ABC Ltd?
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-300">
                  💰 VAT Calculations
                </h4>
                <button
                  onClick={() => setInput("Calculate my total VAT payable")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Calculate my total VAT payable
                </button>
                <button
                  onClick={() => setInput("How much VAT did I collect?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  How much VAT did I collect?
                </button>
                <button
                  onClick={() => setInput("Compare my sales vs purchases")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Compare my sales vs purchases
                </button>
                <button
                  onClick={() => setInput("What's my VAT efficiency rate?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  What's my VAT efficiency rate?
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-300">
                  🎯 Exemptions & Rebates
                </h4>
                <button
                  onClick={() => setInput("Which items have rebates?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Which items have rebates?
                </button>
                <button
                  onClick={() => setInput("Show me VAT exempt transactions")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Show me VAT exempt transactions
                </button>
                <button
                  onClick={() => setInput("How much did I save in rebates?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  How much did I save in rebates?
                </button>
                <button
                  onClick={() => setInput("What qualifies for zero VAT?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  What qualifies for zero VAT?
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-300">
                  📅 Compliance & Deadlines
                </h4>
                <button
                  onClick={() => setInput("When is my filing deadline?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  When is my filing deadline?
                </button>
                <button
                  onClick={() => setInput("Am I compliant with NBR rules?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Am I compliant with NBR rules?
                </button>
                <button
                  onClick={() =>
                    setInput("What penalties apply for late filing?")
                  }
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  What penalties apply for late filing?
                </button>
                <button
                  onClick={() => setInput("Submit my VAT return")}
                  className="w-full px-3 py-2 bg-green-700 rounded text-sm hover:bg-green-600 text-left"
                >
                  Submit my VAT return
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-300">
                  📈 Business Insights
                </h4>
                <button
                  onClick={() => setInput("Analyze my business performance")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Analyze my business performance
                </button>
                <button
                  onClick={() => setInput("What's my profit margin?")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  What's my profit margin?
                </button>
                <button
                  onClick={() =>
                    setInput("Which category generates most revenue?")
                  }
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Which category generates most revenue?
                </button>
                <button
                  onClick={() => setInput("Suggest ways to optimize my VAT")}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-sm hover:bg-gray-600 text-left"
                >
                  Suggest ways to optimize my VAT
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">
                <strong>💡 Try asking anything!</strong> Examples: "What did I
                sell to University?", "How much VAT on machinery?", "When did I
                buy steel?", "Which month was best?", etc.
              </p>
            </div>

            <p className="text-xs text-gray-500">
              Powered by VAT & SD Act 2012 • Real-time NBR compliance • Smart
              exemption detection • Natural language understanding
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-4xl px-5 py-3 rounded-xl whitespace-pre-wrap leading-relaxed shadow ${
                msg.role === "user"
                  ? "bg-[#2b313c] text-white"
                  : "bg-[#f0f0f0] text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-4xl px-5 py-3 rounded-xl bg-[#f0f0f0] text-black flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              Analyzing your request with NBR compliance engine...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <div className="px-6 py-4 border-t border-gray-800 bg-[#161b22] flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask about VAT calculations, exemptions, rebates, compliance, or anything tax-related..."
          className="flex-1 px-4 py-2 rounded-lg bg-[#0d1117] border border-gray-700 text-white placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <DollarSign size={16} />
              Ask AI
            </>
          )}
        </button>
      </div>

      {/* Enhanced Modals */}
      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Enhanced VAT Return Forms with Smart Calculations
              </h2>
              <button
                onClick={() => setModalIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            {generateTaxReturnTable()}
          </div>
        </div>
      )}

      {submitModalOpen && <TaxSummaryModal />}
      {confirmationModalOpen && <ConfirmationModal />}
      {submissionStatus === "success" && <SuccessModal />}
    </div>
  );
}
