const files = import.meta.glob('../data/*.json', { eager: true, import: 'default' });

export const siteData = Object.fromEntries(
  Object.entries(files).map(([path, value]) => [
    path.split('/').pop().replace('.json', ''),
    value,
  ]),
);

export const basics = siteData.budgeting?.budgetingBasics?.concepts ?? [];
export const budgetRule = siteData['50-30-20']?.budgetRule ?? {};
export const expensesConfig = siteData['expense-planner']?.expensePlanner ?? {};
export const tips = siteData.tips?.tips ?? [];
export const botResponses = [
  ...(siteData.chatbot?.responses ?? []),
  ...(siteData.faq_chatbot?.faq ?? []),
];
