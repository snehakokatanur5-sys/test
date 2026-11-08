import { PaperAnalysisData } from '../types';

export const CACHED_PRESETS: Record<string, PaperAnalysisData> = {
  '2312.00752': {
    paper: {
      title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
      authors: ['Albert Gu', 'Tri Dao'],
      yearOrVenue: 'arXiv 2023 / COLM 2024',
      url: 'https://arxiv.org/abs/2312.00752',
      arxivId: '2312.00752',
    },
    coreConcept: {
      problemStatement: 'Standard Transformers suffer from quadratic computational and memory scaling O(N^2) with sequence length due to self-attention. Existing Linear State Space Models (SSMs) offer linear O(N) scaling but suffer from static, time-invariant dynamics that fail to selectively filter out irrelevant context or compress relevant information on associative recall tasks.',
      primaryMethodology: 'Mamba introduces a time-varying Selective State Space Model where state-transition parameters (B, C, and step size Delta) become input-dependent functions of the current token. To make this recurrent formulation fast on modern GPUs, Mamba features an IO-aware hardware scan that fuses recurrence in fast SRAM memory without materializing the expanded hidden state in DRAM.',
      keyBreakthroughs: 'Selective parameter gating enables context-dependent memory retention and selective forgetting, bridging the accuracy gap with Transformers while sustaining 5x higher inference throughput and true linear-time scaling during training.',
      wordCount: 220,
    },
    mermaidFlowchart: `graph TD
  Input[Input Sequence Tokens X] --> LinearIn[Linear Projection & Split]
  LinearIn --> Conv[1D Depthwise Convolution]
  Conv --> SiLU[SiLU Activation]
  SiLU --> SSM[Selective SSM Block: Delta, B, C input-dependent]
  SSM --> HardwareScan[Fused SRAM Scan / Recurrence]
  LinearIn --> Gate[Gating Branch]
  HardwareScan --> Mult[Elementwise Multiplication with Gating]
  Gate --> Mult
  Mult --> LinearOut[Output Linear Projection]
  LinearOut --> Residual[Residual Connection + LayerNorm]
  Residual --> Out[Output Sequence Representations]`,
    studentOpportunities: [
      {
        id: 1,
        title: 'Mamba-Vision Edge Distillation for Embedded Systems',
        extension: 'Replacing heavy Vision Transformer (ViT) self-attention blocks with bidirectional Mamba SSM blocks for edge microcontrollers and Jetson Orin.',
        targetMetric: '3.8x inference latency reduction and 60% memory savings on edge devices with <1.5% accuracy delta on ImageNet-1K.',
        techStack: ['PyTorch', 'ONNX Runtime', 'NVIDIA TensorRT', 'Timm'],
        implementationPlan: 'Weeks 1-2: Port standard ViT blocks to Mamba SSM layers. Week 3: Quantize to FP16/INT8 with TensorRT. Week 4: Benchmark FPS and power dissipation on edge hardware.',
        resumeBullet: 'Engineered a lightweight Vision-Mamba architecture replacing O(N^2) attention with selective SSMs, accelerating edge inference throughput by 3.8x while preserving 98.5% Top-1 classification accuracy.',
        difficulty: 'Intermediate',
        estimatedWeeks: 4,
      },
      {
        id: 2,
        title: 'Hybrid Mamba-Attention KV Cache Optimization',
        extension: 'Constructing a hybrid architecture sandwiching 4:1 ratio of Mamba blocks to sliding-window attention to eliminate KV-cache memory explosion.',
        targetMetric: '75% reduction in KV-cache VRAM consumption during 32k context autoregressive decoding.',
        techStack: ['PyTorch', 'HuggingFace Transformers', 'FlashAttention-2', 'vLLM'],
        implementationPlan: 'Weeks 1-2: Implement interleaved Mamba/Attention layers. Weeks 3-4: Fine-tune on LongBench benchmark. Weeks 5-6: Profile memory footprints under 8k, 16k, and 32k contexts.',
        resumeBullet: 'Architected a hybrid Mamba-Transformer language model cutting KV-cache memory footprint by 75% on 32k token generation tasks using PyTorch and vLLM.',
        difficulty: 'Advanced',
        estimatedWeeks: 6,
      },
      {
        id: 3,
        title: 'Triton Kernel Optimization for Cross-Platform Mamba',
        extension: 'Writing custom OpenAI Triton forward and backward kernels for selective scan to support non-CUDA hardware (AMD ROCm / Apple Metal).',
        targetMetric: 'Matching native CUDA performance within 8% on non-NVIDIA GPUs.',
        techStack: ['OpenAI Triton', 'Python', 'PyTorch C++ Extensions', 'ROCm'],
        implementationPlan: 'Weeks 1-2: Profile SRAM bank conflicts. Weeks 3-4: Implement fused associative scan in Triton. Weeks 5-6: Write cross-platform benchmarking suite.',
        resumeBullet: 'Developed high-throughput fused selective scan kernels in OpenAI Triton, achieving hardware-efficient linear time recurrence on consumer GPUs with 4.2x speedup over un-fused PyTorch.',
        difficulty: 'Advanced',
        estimatedWeeks: 5,
      },
    ],
    openSourceRepos: [
      {
        name: 'state-spaces/mamba',
        description: 'Official implementation of Mamba architecture by Albert Gu and Tri Dao',
        searchQuery: 'state-spaces mamba github',
        url: 'https://github.com/state-spaces/mamba',
      },
      {
        name: 'alxndrgvr/mamba-py',
        description: 'Pure PyTorch, annotated, readable implementation of Mamba for students',
        searchQuery: 'mamba-py github',
        url: 'https://github.com/alxndrgvr/mamba-py',
      },
    ],
  },
  '1706.03762': {
    paper: {
      title: 'Attention Is All You Need',
      authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
      yearOrVenue: 'NeurIPS 2017',
      url: 'https://arxiv.org/abs/1706.03762',
      arxivId: '1706.03762',
    },
    coreConcept: {
      problemStatement: 'Sequential models like Recurrent Neural Networks (RNNs) and LSTMs suffer from sequential training bottlenecks that preclude parallelization across sequence positions, and fail to retain long-range token dependencies across distant positions.',
      primaryMethodology: 'The paper introduces the Transformer, an architecture solely relying on multi-head scaled dot-product self-attention to model dependencies between input and output representations without recurrent or convolutional layers.',
      keyBreakthroughs: 'Multi-Head Attention projects Queries, Keys, and Values into multiple representation subspaces in parallel, combined with sinusoidal positional encodings to preserve token ordering with O(1) sequential operation count.',
      wordCount: 195,
    },
    mermaidFlowchart: `graph TD
  InputTokens[Input Token Embeddings] --> PosEncoding[Positional Encoding Add]
  PosEncoding --> MultiHeadAttn[Multi-Head Self-Attention]
  MultiHeadAttn --> AddNorm1[Add & LayerNorm]
  AddNorm1 --> FeedForward[Position-wise Feed Forward FFN]
  FeedForward --> AddNorm2[Add & LayerNorm]
  AddNorm2 --> LinearProj[Linear Projection Layer]
  LinearProj --> SoftmaxOut[Softmax Probability Output]`,
    studentOpportunities: [
      {
        id: 1,
        title: 'Micro-Transformer with Dynamic Token Pruning',
        extension: 'Implementing adaptive token pruning based on attention score entropy to drop uninformative tokens during intermediate layers.',
        targetMetric: '42% speedup in inference latency with less than 0.8 BLEU point drop on WMT translation.',
        techStack: ['PyTorch', 'HuggingFace Transformers', 'Datasets'],
        implementationPlan: 'Weeks 1-2: Build attention entropy monitor. Week 3: Add threshold-based dynamic mask. Week 4: Benchmark inference FLOPs vs translation quality.',
        resumeBullet: 'Designed dynamic entropy-guided token pruning for Transformer decoders, achieving 42% latency reduction during autoregressive text generation.',
        difficulty: 'Intermediate',
        estimatedWeeks: 4,
      },
      {
        id: 2,
        title: 'Sparse 1-Bit Attention Approximation (Bit-Attention)',
        extension: 'Quantizing attention Query and Key dot-product matrix multiplications into ternary/binary operations for CPU execution.',
        targetMetric: '60% reduction in memory bandwidth pressure on Raspberry Pi 4.',
        techStack: ['PyTorch', 'C++ LibTorch', 'OpenMP'],
        implementationPlan: 'Weeks 1-3: Quantize Q/K vectors with sign thresholding. Weeks 4-5: Optimize bitwise popcount kernel in C++.',
        resumeBullet: 'Implemented a lightweight binary attention engine in C++ LibTorch, slashing CPU memory bandwidth requirements by 60% on resource-constrained single-board computers.',
        difficulty: 'Advanced',
        estimatedWeeks: 5,
      },
      {
        id: 3,
        title: 'Rotary Position Embedding (RoPE) Upgrade for Vanilla Transformer',
        extension: 'Upgrading the fixed sinusoidal positional embeddings to RoPE and evaluating length extrapolation on synthetic long-context tasks.',
        targetMetric: 'Extending context window from 512 to 4096 tokens without retraining from scratch.',
        techStack: ['PyTorch', 'HuggingFace', 'WandB'],
        implementationPlan: 'Weeks 1-2: Replace embedding layer with complex RoPE rotations. Weeks 3-4: Fine-tune on Passkey retrieval test.',
        resumeBullet: 'Upgraded baseline Transformer with Rotary Position Encodings (RoPE), achieving 8x context length extrapolation on passkey retrieval benchmarks.',
        difficulty: 'Intermediate',
        estimatedWeeks: 3,
      },
    ],
    openSourceRepos: [
      {
        name: 'karpathy/nanoGPT',
        description: 'The simplest, fastest repository for training/fine-tuning medium-sized GPTs',
        searchQuery: 'karpathy nanoGPT github',
        url: 'https://github.com/karpathy/nanoGPT',
      },
    ],
  },
  '2106.09685': {
    paper: {
      title: 'LoRA: Low-Rank Adaptation of Large Language Models',
      authors: ['Edward J. Hu', 'Yelong Shen', 'Phillip Wallis', 'Zeyuan Allen-Zhu', 'Yuanzhi Li', 'Shean Wang', 'Lu Wang', 'Weizhu Chen'],
      yearOrVenue: 'ICLR 2022',
      url: 'https://arxiv.org/abs/2106.09685',
      arxivId: '2106.09685',
    },
    coreConcept: {
      problemStatement: 'Fine-tuning all parameters of massive pre-trained language models is computationally prohibitive, consumes terabytes of storage per downstream task, and degrades deployment agility.',
      primaryMethodology: 'LoRA freezes pre-trained model weights W0 and injects trainable rank decomposition matrices (A and B, where rank r << d) into Transformer multi-head attention layers, computing W = W0 + (alpha/r) * B @ A.',
      keyBreakthroughs: 'Reduces the number of trainable parameters by up to 10,000x and GPU memory footprint by 3x with zero added inference latency by folding weights back into W0 at runtime.',
      wordCount: 180,
    },
    mermaidFlowchart: `graph TD
  InputX[Input Activation X] --> FrozenW[Frozen Pretrained Weights W0]
  InputX --> LoRA_A[Trainable Matrix A: d x r]
  LoRA_A --> LoRA_B[Trainable Matrix B: r x k]
  LoRA_B --> Scaling[Scaling Factor alpha / r]
  FrozenW --> Add[Elementwise Sum (+)]
  Scaling --> Add
  Add --> OutputY[Output Activation h = W0*X + (B*A)*X]`,
    studentOpportunities: [
      {
        id: 1,
        title: 'Dynamic Rank-Adaptive LoRA (Ada-LoRA) on Single Consumer GPU',
        extension: 'Allocating rank budget dynamically across attention and MLP layers based on singular value importance during fine-tuning.',
        targetMetric: '35% parameter reduction over uniform rank-8 LoRA with equal or better evaluation perplexity.',
        techStack: ['PyTorch', 'PEFT', 'HuggingFace Transformers', 'BitsAndBytes'],
        implementationPlan: 'Weeks 1-2: Track gradient norms across layers. Week 3: Prune low-importance rank vectors. Week 4: Benchmark GLUE benchmark.',
        resumeBullet: 'Developed dynamic rank-allocation LoRA optimizer on RTX 3060, reducing trainable parameter count by 35% while matching full fine-tuning performance on GLUE benchmarks.',
        difficulty: 'Intermediate',
        estimatedWeeks: 4,
      },
      {
        id: 2,
        title: 'Multi-Task LoRA Hot-Swapping Microservice',
        extension: 'Building a FastAPI / vLLM serving pipeline that dynamically routes user requests to distinct domain-specific LoRA adapters on a single base model.',
        targetMetric: '<5ms adapter switching overhead with 10 concurrent domain adapters.',
        techStack: ['Python', 'FastAPI', 'vLLM', 'Docker', 'PyTorch'],
        implementationPlan: 'Weeks 1-2: Write multi-adapter manager in memory. Weeks 3-4: Build batching queue in FastAPI. Week 5: Profile concurrency under Locust.',
        resumeBullet: 'Engineered a multi-tenant LLM serving system hot-swapping specialized LoRA adapters in <5ms, supporting 10+ concurrent downstream tasks on 1 GPU.',
        difficulty: 'Intermediate',
        estimatedWeeks: 4,
      },
      {
        id: 3,
        title: 'Quantized LoRA (QLoRA) Kernel Fusion in Triton',
        extension: 'Fusing NF4 dequantization directly with low-rank matrix multiplications in an OpenAI Triton kernel.',
        targetMetric: '1.4x fine-tuning step throughput improvement compared to un-fused QLoRA.',
        techStack: ['PyTorch', 'OpenAI Triton', 'CUDA'],
        implementationPlan: 'Weeks 1-2: Dissect NF4 lookup table. Weeks 3-4: Write fused Triton dequantize-matmul kernel. Week 5: Validate gradient correctness.',
        resumeBullet: 'Built high-performance fused 4-bit dequantization and low-rank matrix multiplication kernel in OpenAI Triton, accelerating QLoRA training steps by 40%.',
        difficulty: 'Advanced',
        estimatedWeeks: 5,
      },
    ],
    openSourceRepos: [
      {
        name: 'microsoft/LoRA',
        description: 'Official Microsoft repository for Low-Rank Adaptation of LLMs',
        searchQuery: 'microsoft LoRA github',
        url: 'https://github.com/microsoft/LoRA',
      },
      {
        name: 'huggingface/peft',
        description: 'State-of-the-art Parameter-Efficient Fine-Tuning methods library',
        searchQuery: 'huggingface peft github',
        url: 'https://github.com/huggingface/peft',
      },
    ],
  },
};
