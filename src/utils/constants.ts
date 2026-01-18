// 注意：这些常量已经迁移到翻译文件中
// 请使用 useI18n hook 来获取翻译后的值
// 
// 使用示例：
// const { t } = useI18n();
// const categories = t.constants.softwareCategories;
// const options = t.constants.detectOptions;
// const aiCategories = t.constants.aiDetectCategories;
// const helpContent = t.help.content;

// 保留这些常量仅用于向后兼容（如果需要的话）
// 建议在新代码中直接使用 t.constants.* 和 t.help.content

// 向后兼容：从翻译文件导入中文常量（如果需要）
// 注意：这些是中文版本的默认值，在实际使用中应该通过 useI18n 获取

export const SOFTWARE_CATEGORIES = [
  '视频播放类',
  '网上购物类',
  '社交通讯类',
  '便捷生活类',
  '实用工具类',
  '资讯阅读类',
  '旅行出游类',
] as const;

export const DETECT_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'brief', label: '简介合规性' },
  { key: 'title', label: '标题合规性' },
  { key: 'developer', label: '开发者信息' },
  { key: 'action', label: '动作和目的' },
  { key: 'processing', label: '处理技术' },
  { key: 'dataShare', label: '数据分享' },
  { key: 'dataSecurity', label: '数据安全' },
  { key: 'user', label: '用户权利' },
  { key: 'dataSafe', label: '数据保障' },
  { key: 'international', label: '国际数据传输' },
  { key: 'privacy', label: '隐私策略的变化' },
  { key: 'law', label: '法律依据' },
  { key: 'advertisement', label: '广告使用' },
  { key: 'child', label: '儿童保护' },
];

// AI 检测使用的14个检测类别
export const AI_DETECT_CATEGORIES = [
  {
    key: 'intro',
    name: '隐私政策简介或总体说明',
    description: '是否说明隐私政策的目的、适用范围或总体说明',
  },
  {
    key: 'data_type',
    name: '个人信息或数据类型的描述',
    description: '是否说明涉及或收集的数据类型',
  },
  {
    key: 'collection_method',
    name: '数据收集方式',
    description: '是否说明数据如何被收集（如用户提供、自动收集等）',
  },
  {
    key: 'usage_purpose',
    name: '数据使用目的',
    description: '是否说明数据用于哪些功能或服务目的',
  },
  {
    key: 'data_sharing',
    name: '数据共享或披露说明',
    description: '是否说明数据是否与其他主体共享',
  },
  {
    key: 'third_party',
    name: '第三方服务或外部组件说明',
    description: '是否提及第三方服务、合作方或外部处理主体',
  },
  {
    key: 'storage_security',
    name: '数据存储与安全保护措施',
    description: '是否说明数据存储方式或安全措施',
  },
  {
    key: 'retention_deletion',
    name: '数据保存期限或删除机制',
    description: '是否说明数据保留时间或删除方式',
  },
  {
    key: 'user_rights',
    name: '用户权利说明',
    description: '是否说明用户可行使的隐私相关权利',
  },
  {
    key: 'legal_compliance',
    name: '法律依据或合规性说明',
    description: '是否提及遵守法律法规或监管要求',
  },
  {
    key: 'advertising',
    name: '广告或营销相关的数据使用说明',
    description: '是否说明广告或营销相关的数据使用',
  },
  {
    key: 'children_privacy',
    name: '儿童或未成年人隐私保护说明',
    description: '是否说明儿童或未成年人隐私保护',
  },
  {
    key: 'policy_update',
    name: '隐私政策更新或变更说明',
    description: '是否说明隐私政策更新或变更',
  },
  {
    key: 'contact',
    name: '联系方式、申诉或反馈渠道说明',
    description: '是否说明联系方式、申诉或反馈渠道',
  },
];

export const HELP_CONTENT = [
  {
    title: '简介合规性',
    desc: '隐私政策文件的说明，包括定义文件中使用的人称代词。',
  },
  {
    title: '标题合规性',
    desc: '隐私策略文件的标题中应该明确列示"隐私权政策"字样。',
  },
  {
    title: '开发者信息',
    desc: '应用的商品详情中提到的实体（例如开发者、公司），以及隐私权问题联系人或咨询机制等。',
  },
  {
    title: '动作和目的',
    desc: '包括但不限于个人信息、设备信息等，清晰地列出数据的使用目的，例如用于提供特定服务、改善用户体验、个性化推荐等。',
  },
  {
    title: '处理技术',
    desc: '用户敏感数据的处理流程，以确保数据隐私和安全，例如如何收集和使用cookie及其他类似技术等。',
  },
  {
    title: '数据分享',
    desc: '与第三方合作的开发者如何分享和披露信息，包括公司附属公司、服务提供商或广告合作伙伴。',
  },
  {
    title: '数据安全',
    desc: '为保护用户信息所采用的安全设施和方法。',
  },
  {
    title: '用户权力',
    desc: '例如选择退出数据分享、更正或删除个人数据的权利、对用户隐私和安全的设置等。',
  },
  {
    title: '数据保留',
    desc: '开发者的数据保留和删除政策，数据存储和期限的要求。',
  },
  {
    title: '国际数据传输',
    desc: '阐述有关国际数据传输的情况，特别是在涉及到跨境数据传输时。',
  },
  {
    title: '隐私策略的变化',
    desc: '需要告知用户并保证他们了解隐私策略的变化。',
  },
  {
    title: '法律依据',
    desc: '在隐私策略中引用的隐私法规和条例，如《通用数据保护条例》（GDPR）、《加州消费者隐私法》（CCPA）等。',
  },
  {
    title: '广告使用',
    desc: '如果应用将个人数据和敏感用户数据用于广告的投放，则必须遵守 广告政策。',
  },
  {
    title: '儿童保护',
    desc: '例如在隐私策略中明确定义儿童的年龄范围，对数据访问的条件等。',
  },
];