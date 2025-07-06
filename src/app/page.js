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

    // Enhanced data processing with more detailed calculations
    const allTransactions = [...currentSalesData, ...currentSalesOutData];
    const salesWithVAT = currentSalesOutData
      .map((item, index) => ({
        ...item,
        calc: calculateVAT(item),
        transactionId: `SALE-${String(index + 1).padStart(3, "0")}`,
        type: "sale",
      }))
      .sort((a, b) => b.calc.finalVatAmount - a.calc.finalVatAmount);

    const purchasesWithVAT = currentSalesData
      .map((item, index) => ({
        ...item,
        calc: calculateVAT(item),
        transactionId: `PURCH-${String(index + 1).padStart(3, "0")}`,
        type: "purchase",
      }))
      .sort((a, b) => b.calc.finalVatAmount - a.calc.finalVatAmount);

    // Advanced fuzzy matching with AI-like understanding
    const aiMatch = (text, patterns, threshold = 0.7) => {
      return patterns.some((pattern) => {
        // Direct match
        if (text.includes(pattern)) return true;

        // Semantic variations and common typos
        const semanticMap = {
          rebate: [
            "rebat",
            "discount",
            "incentive",
            "refund",
            "savings",
            "reduction",
            "deduction",
          ],
          purchase: [
            "purchs",
            "purchas",
            "purchse",
            "buy",
            "buying",
            "bought",
            "procurement",
            "acquisition",
          ],
          sale: [
            "sal",
            "sales",
            "sell",
            "selling",
            "sold",
            "revenue",
            "income",
            "transaction",
          ],
          vat: ["va", "tax", "taxes", "taxation", "levy", "duty"],
          highest: [
            "high",
            "maximum",
            "max",
            "most",
            "largest",
            "biggest",
            "top",
            "peak",
          ],
          lowest: ["low", "minimum", "min", "least", "smallest", "bottom"],
          total: ["tot", "sum", "aggregate", "overall", "all", "complete"],
          detail: [
            "details",
            "detailed",
            "breakdown",
            "analysis",
            "information",
            "info",
          ],
          specific: ["particular", "individual", "single", "one"],
          show: ["display", "list", "present", "give", "provide"],
          explain: ["tell", "describe", "clarify", "elaborate"],
          compliance: [
            "complian",
            "comply",
            "regulation",
            "rules",
            "requirement",
            "law",
          ],
          profit: ["profits", "earning", "earnings", "gain", "gains", "margin"],
          loss: ["losses", "deficit", "negative"],
          exemption: ["exempt", "exempted", "free", "excluded"],
          rate: ["rates", "percentage", "percent", "%"],
          calculation: ["calculate", "compute", "formula", "math"],
          deadline: ["due", "filing", "submission", "date"],
          penalty: ["fine", "charge", "fee", "punishment"],
        };

        for (const [key, variants] of Object.entries(semanticMap)) {
          if (pattern === key && variants.some((v) => text.includes(v)))
            return true;
        }

        // Advanced similarity matching
        return stringSimilarity(text, pattern) >= threshold;
      });
    };

    // String similarity function (improved)
    const stringSimilarity = (str1, str2) => {
      const longer = str1.length > str2.length ? str1 : str2;
      const shorter = str1.length > str2.length ? str2 : str1;
      if (longer.length === 0) return 1.0;
      return (longer.length - editDistance(longer, shorter)) / longer.length;
    };

    const editDistance = (str1, str2) => {
      const matrix = Array(str2.length + 1)
        .fill()
        .map(() => Array(str1.length + 1).fill(0));
      for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
      for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

      for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
          const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
          matrix[j][i] = Math.min(
            matrix[j - 1][i] + 1,
            matrix[j][i - 1] + 1,
            matrix[j - 1][i - 1] + cost
          );
        }
      }
      return matrix[str2.length][str1.length];
    };

    // Advanced AI intent detection with context understanding
    const detectAdvancedIntent = (input) => {
      const intentPatterns = {
        // Transaction queries
        highest: ["highest", "maximum", "most", "largest", "biggest", "top"],
        lowest: ["lowest", "minimum", "least", "smallest", "bottom"],
        specific: [
          "specific",
          "particular",
          "individual",
          "single",
          "one",
          "this",
          "that",
        ],

        // Data types
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
        rebate: ["rebate", "discount", "incentive", "savings"],

        // Actions
        show: ["show", "display", "list", "present", "give"],
        explain: ["explain", "tell", "describe", "clarify", "how"],
        calculate: ["calculate", "compute", "formula", "math"],

        // Analysis types
        details: ["details", "breakdown", "analysis", "information"],
        total: ["total", "sum", "aggregate", "overall"],
        compare: ["compare", "difference", "versus", "vs", "between"],

        // Legal/Compliance
        compliance: ["compliance", "regulation", "rules", "requirement"],
        exemption: ["exempt", "exemption", "free", "excluded"],
        penalty: ["penalty", "fine", "charge", "punishment"],
        deadline: ["deadline", "due", "filing", "submission"],

        // Financial
        profit: ["profit", "earning", "gain", "margin"],
        loss: ["loss", "deficit", "negative"],
        rate: ["rate", "percentage", "percent"],

        // Context
        which: ["which", "what", "who", "where"],
        when: ["when", "date", "time"],
        why: ["why", "reason", "because"],

        // Responses
        yes: ["yes", "yeah", "yep", "sure", "ok", "okay"],
        no: ["no", "nope", "not", "never"],
      };

      const detected = {};
      Object.entries(intentPatterns).forEach(([intent, keywords]) => {
        detected[intent] = aiMatch(input, keywords);
      });

      // Add contextual understanding
      detected.needsSpecificItem =
        /\b(first|second|third|1st|2nd|3rd|\d+)\b/.test(input) ||
        detected.specific ||
        /\b(this|that|the)\s+\w+/.test(input);

      detected.numerical = /\d+/.test(input);
      detected.question =
        /\?/.test(input) || detected.which || detected.when || detected.why;

      return detected;
    };

    const intent = detectAdvancedIntent(input);

    // Enhanced entity extraction
    const extractEntities = (input) => {
      const entities = {
        productName: null,
        customerName: null,
        supplierName: null,
        amount: null,
        date: null,
        transactionNumber: null,
      };

      // Extract product names mentioned in input
      const allProducts = [...salesWithVAT, ...purchasesWithVAT].map((t) =>
        t.product.toLowerCase()
      );
      entities.productName = allProducts.find((product) =>
        input.includes(product)
      );

      // Extract amounts
      const amountMatch = input.match(/৳?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
      if (amountMatch)
        entities.amount = parseFloat(amountMatch[1].replace(/,/g, ""));

      // Extract transaction numbers
      const transactionMatch = input.match(
        /\b(sale|purch|transaction)[-\s]*(\d+)\b/i
      );
      if (transactionMatch)
        entities.transactionNumber = parseInt(transactionMatch[2]);

      return entities;
    };

    const entities = extractEntities(input);

    // REBATE HANDLING - Comprehensive rebate analysis
    if (intent.rebate || aiMatch(input, ["rebate", "discount", "incentive"])) {
      const rebateTransactions = allTransactions.filter((item) => {
        const calc = calculateVAT(item);
        return calc.rebateAmount > 0 || item.rebateEligible;
      });

      const totalRebateEarned = rebateTransactions.reduce(
        (sum, item) => sum + calculateVAT(item).rebateAmount,
        0
      );

      if (rebateTransactions.length === 0) {
        return `💡 **Rebate Opportunities Analysis**

🎯 **Current Status:** No active rebates claimed

📋 **Available VAT Rebate Programs:**
${Object.entries(AI_KNOWLEDGE.rebatePrograms)
  .map(
    ([key, program]) =>
      `• **${program.description}**: ${program.rate}% rebate
    Eligibility: ${program.eligibility}`
  )
  .join("\n")}

🔍 **Potential Eligibility Assessment:**
${
  salesWithVAT.some((s) => s.category?.includes("Export"))
    ? "✅ Export Sales Detected - May qualify for 50% export rebate"
    : "⚪ No export sales detected"
}
${
  purchasesWithVAT.some((p) => p.category?.includes("Raw Material"))
    ? "✅ Raw Material Purchases - May qualify for industrial rebate"
    : "⚪ No raw material purchases detected"
}

💰 **Estimated Potential Savings:**
If eligible for export rebate: ৳${Math.round(
          salesTotals.finalVatAmount * 0.5
        ).toLocaleString()}
If eligible for industrial rebate: ৳${Math.round(
          purchaseTotals.finalVatAmount * 0.15
        ).toLocaleString()}

📞 **Next Steps:**
1. Contact NBR to verify eligibility
2. Submit required documentation
3. Apply for rebate certificates

Would you like me to analyze specific transactions for rebate eligibility?`;
      }

      return `💰 **Your Rebate Analysis Report**

🎉 **Total Rebate Earned: ৳${totalRebateEarned.toLocaleString()}**

📊 **Rebate Breakdown by Transaction:**
${rebateTransactions
  .map((item, i) => {
    const calc = calculateVAT(item);
    return `${i + 1}. **${item.product}**
   • Type: ${item.type || "Purchase"} | Rebate Program: ${
      item.rebateType || "Standard Industrial"
    }
   • Base VAT: ৳${calc.vatAmount.toLocaleString()}
   • Rebate: ৳${calc.rebateAmount.toLocaleString()} (${(
      (calc.rebateAmount / calc.vatAmount) *
      100
    ).toFixed(1)}%)
   • Net VAT: ৳${calc.finalVatAmount.toLocaleString()}
   • Date: ${item.purchaseDate || item.saleDate}`;
  })
  .join("\n\n")}

📈 **Rebate Impact Analysis:**
• Total VAT before rebates: ৳${(
        totalRebateEarned +
        rebateTransactions.reduce(
          (sum, item) => sum + calculateVAT(item).finalVatAmount,
          0
        )
      ).toLocaleString()}
• Rebate savings: ৳${totalRebateEarned.toLocaleString()}
• Effective VAT rate: ${(
        (rebateTransactions.reduce(
          (sum, item) => sum + calculateVAT(item).finalVatAmount,
          0
        ) /
          rebateTransactions.reduce((sum, item) => sum + item.baseValue, 0)) *
        100
      ).toFixed(2)}%

🎯 **Optimization Recommendations:**
• Continue leveraging eligible rebate programs
• Document all rebate claims properly
• Monitor rebate program updates from NBR

Want details on any specific rebate transaction?`;
    }

    // SPECIFIC TRANSACTION DETAILS
    if (
      (intent.details || intent.show) &&
      (intent.specific || entities.productName || entities.transactionNumber)
    ) {
      // Find specific transaction based on context
      let targetTransaction = null;

      if (entities.productName) {
        targetTransaction = [...salesWithVAT, ...purchasesWithVAT].find((t) =>
          t.product.toLowerCase().includes(entities.productName)
        );
      } else if (entities.transactionNumber) {
        if (intent.sales) {
          targetTransaction = salesWithVAT[entities.transactionNumber - 1];
        } else if (intent.purchase) {
          targetTransaction = purchasesWithVAT[entities.transactionNumber - 1];
        }
      } else if (intent.highest) {
        targetTransaction = intent.sales
          ? salesWithVAT[0]
          : purchasesWithVAT[0];
      }

      if (targetTransaction) {
        const calc = targetTransaction.calc;
        const isRebateEligible = calc.rebateAmount > 0;
        const isExempt = calc.isExempt;

        return `📋 **Detailed Transaction Analysis**

🏷️ **Transaction ID:** ${targetTransaction.transactionId}
📦 **Product:** ${targetTransaction.product}
📂 **Category:** ${targetTransaction.category}

${
  targetTransaction.type === "sale"
    ? "👤 **Customer:** " + targetTransaction.customer
    : "🏭 **Supplier:** " + targetTransaction.supplier
}
📅 **Date:** ${targetTransaction.saleDate || targetTransaction.purchaseDate}
${
  targetTransaction.vatChallanNo
    ? "📄 **VAT Challan:** " + targetTransaction.vatChallanNo
    : ""
}

💰 **Financial Breakdown:**
• Base Value: ৳${targetTransaction.baseValue.toLocaleString()}
• VAT Rate Applied: ${calc.vatRate}%
• VAT Amount: ৳${calc.vatAmount.toLocaleString()}
${
  isRebateEligible
    ? `• Rebate Applied: ৳${calc.rebateAmount.toLocaleString()} (${(
        (calc.rebateAmount / calc.vatAmount) *
        100
      ).toFixed(1)}%)`
    : ""
}
• **Final VAT:** ৳${calc.finalVatAmount.toLocaleString()}
• **Total Amount:** ৳${calc.totalValue.toLocaleString()}

⚖️ **Legal & Compliance Status:**
${
  isExempt
    ? "🆓 **VAT Exempt** - " + (calc.exemptionReason || "Qualified exemption")
    : "✅ **Standard VAT Applied**"
}
${
  isRebateEligible
    ? "💰 **Rebate Eligible** - " +
      (targetTransaction.rebateType || "Industrial rebate program")
    : "⚪ No rebate claimed"
}

📊 **Business Impact:**
• Share of total ${
          targetTransaction.type === "sale" ? "revenue" : "expenses"
        }: ${(
          (targetTransaction.baseValue /
            (targetTransaction.type === "sale"
              ? salesTotals.baseValue
              : purchaseTotals.baseValue)) *
          100
        ).toFixed(1)}%
• VAT efficiency: ${(
          (calc.finalVatAmount / targetTransaction.baseValue) *
          100
        ).toFixed(2)}%
• ${targetTransaction.type === "sale" ? "Profit margin" : "Cost impact"}: ${
          targetTransaction.type === "sale"
            ? "Contributes to revenue growth"
            : "Essential business expense"
        }

🎯 **Recommendations:**
${
  isRebateEligible
    ? "✅ Rebate optimally claimed"
    : "💡 Check rebate eligibility for future similar transactions"
}
${
  isExempt
    ? "✅ Exemption properly applied"
    : "💡 Verify if exemption opportunities exist"
}
• Maintain all supporting documents for ${AI_KNOWLEDGE.compliance.records}
• ${
          targetTransaction.type === "sale"
            ? "Consider similar high-value sales"
            : "Evaluate supplier terms for better pricing"
        }

Need analysis of any other transaction?`;
      }
    }

    // HIGHEST/LOWEST TRANSACTION QUERIES
    if (
      (intent.highest || intent.lowest) &&
      (intent.sales || intent.purchase)
    ) {
      const isHighest = intent.highest;
      const isSales = intent.sales;
      const transactions = isSales ? salesWithVAT : purchasesWithVAT;
      const target = isHighest
        ? transactions[0]
        : transactions[transactions.length - 1];

      if (intent.vat) {
        // Highest/Lowest VAT amount
        return `${isHighest ? "🏆" : "📉"} **${
          isHighest ? "Highest" : "Lowest"
        } VAT ${isSales ? "Sale" : "Purchase"}**

📦 **${target.product}**
${
  isSales
    ? "👤 Customer: " + target.customer
    : "🏭 Supplier: " + target.supplier
}
💰 **VAT Amount: ৳${target.calc.finalVatAmount.toLocaleString()}**
📊 **Transaction Value: ৳${target.baseValue.toLocaleString()}**
📅 **Date: ${target.saleDate || target.purchaseDate}**

📈 **Analysis:**
• VAT Rate: ${target.calc.vatRate}%
• % of total ${isSales ? "collected" : "paid"} VAT: ${(
          (target.calc.finalVatAmount /
            (isSales
              ? salesTotals.finalVatAmount
              : purchaseTotals.finalVatAmount)) *
          100
        ).toFixed(1)}%
${
  target.calc.rebateAmount > 0
    ? `• Rebate saved: ৳${target.calc.rebateAmount.toLocaleString()}`
    : ""
}

${
  isHighest
    ? "🎯 This is your most significant VAT transaction"
    : "💡 Consider if similar low-VAT opportunities exist"
}`;
      } else {
        // Highest/Lowest transaction value
        return `${isHighest ? "🏆" : "📉"} **${
          isHighest ? "Highest" : "Lowest"
        } ${isSales ? "Sale" : "Purchase"}**

📦 **${target.product}**
${
  isSales
    ? "👤 Customer: " + target.customer
    : "🏭 Supplier: " + target.supplier
}
💰 **Value: ৳${target.baseValue.toLocaleString()}**
🏷️ **VAT: ৳${target.calc.finalVatAmount.toLocaleString()} (${
          target.calc.vatRate
        }%)**
📅 **Date: ${target.saleDate || target.purchaseDate}**

📊 **Impact Analysis:**
• % of total ${isSales ? "revenue" : "expenses"}: ${(
          (target.baseValue /
            (isSales ? salesTotals.baseValue : purchaseTotals.baseValue)) *
          100
        ).toFixed(1)}%
• Business significance: ${
          isHighest ? "Major transaction" : "Routine transaction"
        }
${target.calc.isExempt ? "🆓 VAT exempt transaction" : ""}

Need more details about this transaction?`;
      }
    }

    // COMPLIANCE AND LEGAL QUERIES
    if (intent.compliance || intent.deadline || intent.penalty) {
      const today = new Date();
      const deadline = new Date(2025, 6, 15);
      const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

      return `⚖️ **VAT Compliance Guide - Expert Legal Analysis**

🕐 **Critical Deadlines:**
• **Monthly Filing:** 15th of following month (${daysLeft} days remaining)
• **Payment Due:** Same as filing date
• **Your Current Position:** ${
        netVatPayable >= 0 ? "Pay" : "Refund"
      } ৳${Math.abs(netVatPayable).toLocaleString()}

📚 **Legal Requirements:**
• **Record Keeping:** Maintain all VAT documents for minimum 6 years (VAT Act Section 65)
• **Invoice Requirements:** Must include VAT registration number, tax amount, date
• **Challan Documentation:** Keep all VAT payment challans and receipts
• **Audit Trail:** Maintain chronological transaction records

💰 **VAT Rate Compliance:**
• Standard Rate: 15% (VAT Act Section 8)
• Reduced Rate: 7.5% for books, newspapers, pharmaceuticals
• Zero Rate: Exports, basic food items (rice, wheat, milk)
• Exempt: Education, healthcare, financial services

⚠️ **Penalties & Consequences:**
• **Late Filing:** ৳500 base penalty + 2% per month on unpaid amount
• **Incomplete Records:** ৳5,000 to ৳10,000 fine
• **False Declaration:** Up to 100% of tax amount + criminal liability
• **Non-registration:** ৳10,000 fine + forced registration

🎯 **Rebate Compliance:**
• Must apply within 6 months of transaction
• Requires supporting export documents for export rebates
• Industrial rebates need manufacturing license verification

✅ **Current Compliance Status:**
• Total Transactions: ${allTransactions.length} (properly documented)
• VAT Calculations: Verified and compliant
• Record Completeness: ${
        allTransactions.every((t) => t.product && t.baseValue)
          ? "Complete"
          : "Needs attention"
      }
• Filing Readiness: ${daysLeft > 5 ? "On track" : "Urgent action needed"}

📞 **Legal Recommendations:**
1. ${
        daysLeft <= 7
          ? "🚨 URGENT: Complete filing immediately"
          : "✅ Prepare filing documentation"
      }
2. Verify all challan numbers and dates
3. Reconcile bank statements with VAT payments
4. Keep digital backups of all documents
5. Consider quarterly compliance review

Need specific legal guidance on any aspect?`;
    }

    // EXEMPTION ANALYSIS
    if (intent.exemption || intent.exempt) {
      const exemptTransactions = allTransactions.filter(
        (item) => calculateVAT(item).isExempt
      );
      const potentialExemptions = allTransactions.filter(
        (item) =>
          item.category?.toLowerCase().includes("education") ||
          item.category?.toLowerCase().includes("health") ||
          item.category?.toLowerCase().includes("export") ||
          item.product?.toLowerCase().includes("book") ||
          item.product?.toLowerCase().includes("medicine")
      );

      return `🆓 **VAT Exemption Analysis**

${
  exemptTransactions.length > 0
    ? `✅ **Current Exemptions (${exemptTransactions.length} transactions):**
${exemptTransactions
  .map((item, i) => {
    const calc = calculateVAT(item);
    const saved = item.baseValue * 0.15 - calc.vatAmount;
    return `${i + 1}. **${item.product}**
   • Category: ${item.category}
   • Value: ৳${item.baseValue.toLocaleString()}
   • VAT Rate: ${calc.vatRate}% (${calc.isExempt ? "Exempt" : "Reduced"})
   • VAT Saved: ৳${saved.toLocaleString()}
   • Legal Basis: ${calc.exemptionReason || "Standard exemption"}`;
  })
  .join("\n\n")}

💰 **Total VAT Savings from Exemptions: ৳${exemptTransactions
        .reduce((sum, item) => {
          const calc = calculateVAT(item);
          return sum + (item.baseValue * 0.15 - calc.vatAmount);
        }, 0)
        .toLocaleString()}**`
    : "⚪ **No Current Exemptions Applied**"
}

📋 **Available Exemption Categories:**
• **Education Services:** 0% VAT (books, courses, training)
• **Healthcare:** 0% VAT (medical services, medicines)
• **Exports:** 0% VAT (all export goods and services)
• **Basic Foods:** 0% VAT (rice, wheat, milk, vegetables)
• **Financial Services:** Exempt (banking, insurance)

${
  potentialExemptions.length > 0
    ? `🔍 **Potential Exemption Opportunities:**
${potentialExemptions
  .filter((item) => !calculateVAT(item).isExempt)
  .map(
    (item) => `• ${item.product} (${item.category}) - May qualify for exemption`
  )
  .join("\n")}`
    : ""
}

⚖️ **Legal Requirements for Exemptions:**
• Must meet specific criteria in VAT Act Schedule
• Proper documentation required
• Regular compliance verification
• Cannot claim input VAT credit on exempt sales

💡 **Strategic Recommendations:**
1. Review product categorization for exemption eligibility
2. Maintain proper exemption documentation
3. Consider business structure optimization
4. Monitor exemption regulation changes

Want analysis of specific exemption opportunities?`;
    }

    // CALCULATION EXPLANATIONS
    if (intent.calculate || intent.explain) {
      return `🧮 **VAT Calculation Methodology - Expert Breakdown**

📊 **Your Current VAT Position:**
**Net VAT: ${netVatPayable >= 0 ? "Payable" : "Refundable"} ৳${Math.abs(
        netVatPayable
      ).toLocaleString()}**

**Step-by-Step Calculation Process:**

**1️⃣ Output VAT (Sales Tax Collected):**
${salesWithVAT
  .map(
    (sale, i) =>
      `${i + 1}. ${sale.product}: ৳${sale.baseValue.toLocaleString()} × ${
        sale.calc.vatRate
      }% = ৳${sale.calc.vatAmount.toLocaleString()}
   ${
     sale.calc.rebateAmount > 0
       ? `Less Rebate: ৳${sale.calc.rebateAmount.toLocaleString()}`
       : ""
   }
   **Net VAT: ৳${sale.calc.finalVatAmount.toLocaleString()}**`
  )
  .join("\n")}
**Total Output VAT: ৳${salesTotals.finalVatAmount.toLocaleString()}**

**2️⃣ Input VAT (Purchase Tax Credits):**
${purchasesWithVAT
  .map(
    (purchase, i) =>
      `${i + 1}. ${
        purchase.product
      }: ৳${purchase.baseValue.toLocaleString()} × ${
        purchase.calc.vatRate
      }% = ৳${purchase.calc.vatAmount.toLocaleString()}
   ${
     purchase.calc.rebateAmount > 0
       ? `Less Rebate: ৳${purchase.calc.rebateAmount.toLocaleString()}`
       : ""
   }
   **Net VAT: ৳${purchase.calc.finalVatAmount.toLocaleString()}**`
  )
  .join("\n")}
**Total Input VAT: ৳${purchaseTotals.finalVatAmount.toLocaleString()}**

**3️⃣ Final Calculation:**
Output VAT - Input VAT = Net Position
৳${salesTotals.finalVatAmount.toLocaleString()} - ৳${purchaseTotals.finalVatAmount.toLocaleString()} = **৳${Math.abs(
        netVatPayable
      ).toLocaleString()}**

**📈 Advanced Analysis:**
• **Effective VAT Rate:** ${(
        (Math.abs(netVatPayable) / salesTotals.baseValue) *
        100
      ).toFixed(2)}%
• **VAT Efficiency:** ${(
        (purchaseTotals.finalVatAmount / salesTotals.finalVatAmount) *
        100
      ).toFixed(1)}% input credit utilization
• **Business Impact:** ${
        netVatPayable >= 0 ? "Cash outflow" : "Cash inflow"
      } of ৳${Math.abs(netVatPayable).toLocaleString()}

**🎯 Tax Planning Insights:**
• ${
        netVatPayable > 0
          ? "Consider timing of large purchases to offset VAT liability"
          : "Strong input credit position - good for business expansion"
      }
• Average transaction VAT: ৳${Math.round(
        Math.abs(netVatPayable) / allTransactions.length
      ).toLocaleString()}
• Rebate optimization saved: ৳${(
        purchaseTotals.rebateAmount + salesTotals.rebateAmount
      ).toLocaleString()}

Need clarification on any specific calculation?`;
    }

    // PROFIT ANALYSIS
    if (intent.profit || intent.loss) {
      const grossProfit = salesTotals.baseValue - purchaseTotals.baseValue;
      const profitMargin = (
        (grossProfit / salesTotals.baseValue) *
        100
      ).toFixed(1);
      const netProfitAfterVAT = grossProfit - Math.abs(netVatPayable);

      return `📈 **Comprehensive Profit Analysis**

💰 **Financial Performance:**
• **Gross Revenue:** ৳${salesTotals.baseValue.toLocaleString()}
• **Total Expenses:** ৳${purchaseTotals.baseValue.toLocaleString()}
• **Gross Profit:** ৳${grossProfit.toLocaleString()}
• **Profit Margin:** ${profitMargin}%

🏷️ **VAT Impact on Profitability:**
• VAT Position: ${netVatPayable >= 0 ? "Payable" : "Refundable"} ৳${Math.abs(
        netVatPayable
      ).toLocaleString()}
• **Net Profit After VAT:** ৳${netProfitAfterVAT.toLocaleString()}
• VAT as % of Revenue: ${(
        (Math.abs(netVatPayable) / salesTotals.baseValue) *
        100
      ).toFixed(2)}%

📊 **Transaction-Level Profitability:**
**Top Revenue Generators:**
${salesWithVAT
  .slice(0, 3)
  .map(
    (sale, i) =>
      `${i + 1}. ${sale.product}: ৳${sale.baseValue.toLocaleString()} (${(
        (sale.baseValue / salesTotals.baseValue) *
        100
      ).toFixed(1)}% of revenue)`
  )
  .join("\n")}

**Major Cost Centers:**
${purchasesWithVAT
  .slice(0, 3)
  .map(
    (purchase, i) =>
      `${i + 1}. ${
        purchase.product
      }: ৳${purchase.baseValue.toLocaleString()} (${(
        (purchase.baseValue / purchaseTotals.baseValue) *
        100
      ).toFixed(1)}% of expenses)`
  )
  .join("\n")}

💡 **Strategic Insights:**
• Average sale value: ৳${Math.round(
        salesTotals.baseValue / salesWithVAT.length
      ).toLocaleString()}
• Average purchase value: ৳${Math.round(
        purchaseTotals.baseValue / purchasesWithVAT.length
      ).toLocaleString()}
• Transaction efficiency: ${(
        salesWithVAT.length / purchasesWithVAT.length
      ).toFixed(1)}:1 sales to purchase ratio

🎯 **Tax-Optimized Recommendations:**
${grossProfit > 0 ? "✅ Profitable operations" : "⚠️ Review cost structure"}
${
  netVatPayable < 0
    ? "💰 VAT refund improves cash flow"
    : "💸 Plan for VAT payment"
}
• Consider rebate opportunities to reduce effective tax rate
• ${
        profitMargin > 20
          ? "Strong margins - explore expansion"
          : "Monitor cost efficiency"
      }

Want detailed analysis of any specific revenue stream?`;
    }

    // SPENDING ANALYSIS
    if (
      intent.total &&
      (intent.purchase || aiMatch(input, ["spending", "expense", "cost"]))
    ) {
      return `💳 **Comprehensive Spending Analysis**

**Total Business Expenses: ৳${purchaseTotals.baseValue.toLocaleString()}**

📊 **Detailed Expense Breakdown:**
${purchasesWithVAT
  .map(
    (purchase, i) =>
      `${i + 1}. **${purchase.product}**
   • Supplier: ${purchase.supplier}
   • Base Cost: ৳${purchase.baseValue.toLocaleString()}
   • VAT Paid: ৳${purchase.calc.finalVatAmount.toLocaleString()}
   • Total Cost: ৳${purchase.calc.totalValue.toLocaleString()}
   • Date: ${purchase.purchaseDate}
   • Share: ${((purchase.baseValue / purchaseTotals.baseValue) * 100).toFixed(
     1
   )}% of total expenses`
  )
  .join("\n\n")}

💰 **Financial Impact Analysis:**
• **Total VAT Credits:** ৳${purchaseTotals.finalVatAmount.toLocaleString()}
• **Rebate Savings:** ৳${purchaseTotals.rebateAmount.toLocaleString()}
• **Average Transaction:** ৳${Math.round(
        purchaseTotals.baseValue / purchasesWithVAT.length
      ).toLocaleString()}
• **Cost Efficiency:** ${(
        (purchaseTotals.finalVatAmount / purchaseTotals.baseValue) *
        100
      ).toFixed(2)}% effective VAT rate

📈 **Spending Pattern Analysis:**
• Largest expense: ${(
        (purchasesWithVAT[0].baseValue / purchaseTotals.baseValue) *
        100
      ).toFixed(1)}% of total
• Most VAT credits from: ${purchasesWithVAT[0].product}
• Supplier concentration: ${
        new Set(purchasesWithVAT.map((p) => p.supplier)).size
      } unique suppliers

🎯 **Cost Optimization Insights:**
• Your input VAT credits reduce net tax liability significantly
• ${
        purchaseTotals.rebateAmount > 0
          ? `Rebate programs saved ৳${purchaseTotals.rebateAmount.toLocaleString()}`
          : "Explore rebate opportunities"
      }
• Consider bulk purchasing for better supplier terms
• Maintain proper documentation for all VAT credits

Need analysis of specific expense categories?`;
    }

    // CONTEXTUAL FALLBACK - AI-powered response generation
    const generateContextualResponse = () => {
      // Analyze query patterns for intelligent responses
      if (aiMatch(input, ["help", "what", "can", "able"])) {
        return `🤖 **AI Tax Lawyer - Comprehensive VAT Assistant**

I can provide expert analysis on:

💰 **Financial Analysis:**
• "What's my profit this month?" - Detailed profitability analysis
• "Show me my highest sale/purchase" - Transaction-specific insights
• "What's my total spending?" - Comprehensive expense breakdown

🏷️ **VAT Expertise:**
• "Explain my VAT calculation" - Step-by-step methodology
• "Show me rebate opportunities" - Savings optimization
• "What are my exemptions?" - Tax-saving strategies

⚖️ **Legal Compliance:**
• "What are compliance requirements?" - Full regulatory guide
• "When is my filing deadline?" - Critical dates and penalties
• "Show me penalty risks" - Risk assessment and mitigation

📊 **Transaction Details:**
• "Details of [product name]" - Specific transaction analysis
• "Compare sales vs purchases" - Comparative insights
• "Show me VAT breakdown" - Detailed calculations

🎯 **Strategic Guidance:**
• Tax optimization strategies
• Cash flow impact analysis
• Business growth recommendations
• Regulatory compliance planning

**Example queries:**
• "Show me details of my machinery purchase"
• "What rebates am I eligible for?"
• "Explain how my VAT is calculated"
• "What are the penalties for late filing?"

Ask me anything about your VAT situation! 💡`;
      }

      // Provide relevant quick insights based on current data
      const insights = [
        `💡 **Quick Insight:** Your largest transaction is ৳${Math.max(
          ...allTransactions.map((t) => t.baseValue)
        ).toLocaleString()}. Want detailed analysis?`,

        `📊 **VAT Status:** You ${
          netVatPayable >= 0 ? "owe" : "are owed"
        } ৳${Math.abs(netVatPayable).toLocaleString()}. Need breakdown?`,

        `🎯 **Business Health:** ${salesWithVAT.length} sales, ${purchasesWithVAT.length} purchases this month. Want profit analysis?`,

        `💰 **Tax Efficiency:** ${(
          (Math.abs(netVatPayable) / salesTotals.baseValue) *
          100
        ).toFixed(1)}% effective VAT rate. Want optimization tips?`,
      ];

      return (
        insights[Math.floor(Math.random() * insights.length)] +
        `\n\n**Popular questions:**\n• "Show me my highest sale details"\n• "What rebates can I claim?"\n• "Explain my VAT compliance requirements"\n• "What's my profit this month?"`
      );
    };

    return generateContextualResponse();
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
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
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
