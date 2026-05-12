import { 
    ChartLineUpIcon, 
    UsersIcon, 
    TruckIcon, 
    CurrencyDollarIcon, 
    ClockCounterClockwiseIcon, 
    ArchiveBoxIcon, 
    SquaresFourIcon, 
    ReceiptIcon, 
    ArrowsClockwiseIcon, 
    ShoppingCartIcon, 
    ArticleIcon, 
    CalendarPlusIcon 
} from "@phosphor-icons/react";

export const QUICK_CARDS = [
    {
        title: 'Performance de Produtos',
        description: 'Identifique os mais vendidos, produtos sem estoque e oportunidades de preço.',
        mcp_prompt: 'analyze_product_performance',
        icon: ChartLineUpIcon
    },
    {
        title: 'Segmentação de Clientes',
        description: 'Agrupe clientes por valor gasto, tempo de inatividade e localização.',
        mcp_prompt: 'customer_segmentation',
        icon: UsersIcon
    },
    {
        title: 'Logística e Envios',
        description: 'Analise o tempo médio de preparo e os pedidos pagos aguardando envio.',
        mcp_prompt: 'order_fulfillment_analysis',
        icon: TruckIcon
    },
    {
        title: 'Análise de Faturamento',
        description: 'Acompanhe a receita total, ticket médio e tendências de vendas recentes.',
        mcp_prompt: 'revenue_analysis',
        icon: CurrencyDollarIcon
    },
    {
        title: 'Recuperar Pedidos',
        description: 'Crie estratégias e cupons focados em recuperar pedidos pendentes.',
        mcp_prompt: 'abandoned_orders_recovery',
        icon: ClockCounterClockwiseIcon
    },
    {
        title: 'Gestão de Estoque',
        description: 'Encontre estoque crítico, giro de produtos e variações paradas.',
        mcp_prompt: 'inventory_management_analysis',
        icon: ArchiveBoxIcon
    },
    {
        title: 'Otimização de Variações',
        description: 'Audite a performance de variações e identifique furos de cadastro como SKUs faltando.',
        mcp_prompt: 'variant_optimization',
        icon: SquaresFourIcon
    },
    {
        title: 'Análise de Cobranças',
        description: 'Revise assinaturas ativas, MRR, ARR e padrões de uso da loja.',
        mcp_prompt: 'billing_analysis',
        icon: ReceiptIcon
    },
    {
        title: 'Gestão de Assinaturas',
        description: 'Monitore risco de churn, datas de cobrança e oportunidades de upsell.',
        mcp_prompt: 'subscription_management',
        icon: ArrowsClockwiseIcon
    },
    {
        title: 'Checkouts Abandonados',
        description: 'Recupere carrinhos de alto valor identificando atritos e gerando cupons.',
        mcp_prompt: 'abandoned_checkout_strategy',
        icon: ShoppingCartIcon
    },
    {
        title: 'Estratégia de Blog e SEO',
        description: 'Audite o SEO das postagens, imagens de capa e sugira novos tópicos.',
        mcp_prompt: 'blog_content_strategy',
        icon: ArticleIcon
    },
    {
        title: 'Calendário de Postagens',
        description: 'Organize os rascunhos do blog, crie SEO pendente e defina um calendário.',
        mcp_prompt: 'blog_publication_calendar',
        icon: CalendarPlusIcon
    }
];