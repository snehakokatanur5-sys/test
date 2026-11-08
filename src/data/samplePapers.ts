export interface PresetPaper {
  id: string;
  title: string;
  venue: string;
  url: string;
  arxivId: string;
  category: string;
  description: string;
}

export const PRESET_PAPERS: PresetPaper[] = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    venue: 'NeurIPS 2017',
    url: 'https://arxiv.org/abs/1706.03762',
    arxivId: '1706.03762',
    category: 'LLMs & Deep Learning',
    description: 'Introduced the Transformer architecture dispensing with recurrence and convolutions entirely.',
  },
  {
    id: 'mamba-state-space',
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    venue: 'arXiv 2023',
    url: 'https://arxiv.org/abs/2312.00752',
    arxivId: '2312.00752',
    category: 'Architecture & Efficiency',
    description: 'Selective State Space Model (SSM) achieving linear scaling with 5x higher throughput than Transformers.',
  },
  {
    id: 'lora-low-rank',
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    venue: 'ICLR 2022',
    url: 'https://arxiv.org/abs/2106.09685',
    arxivId: '2106.09685',
    category: 'Fine-Tuning & Systems',
    description: 'Freezes pre-trained model weights and injects trainable rank decomposition matrices into layers.',
  },
  {
    id: 'flash-attention',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness',
    venue: 'NeurIPS 2022',
    url: 'https://arxiv.org/abs/2205.14135',
    arxivId: '2205.14135',
    category: 'Systems & GPU Hardware',
    description: 'IO-aware exact attention algorithm leveraging GPU SRAM tiling to cut wall-clock training time by 3x.',
  },
  {
    id: 'direct-preference-optimization',
    title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
    venue: 'NeurIPS 2023',
    url: 'https://arxiv.org/abs/2305.18290',
    arxivId: '2305.18290',
    category: 'RLHF & Alignment',
    description: 'Replaces complex reinforcement learning from human feedback with a stable closed-form classification loss.',
  },
];
