/**
 * Technical Skill Verification Quiz Bank & Assessment Engine
 * Provides realistic 5-question technical drills with code snippets and explanations.
 */

import { SkillCompetency, SkillQuizQuestion } from '../types/roadmap';

export const CURATED_SKILL_QUIZZES: Record<string, SkillQuizQuestion[]> = {
  // vLLM / Distributed Inference
  'sk-core-2': [
    {
      id: 'q-vllm-1',
      question: 'In vLLM’s PagedAttention algorithm, what primary inefficiency of standard LLM serving is solved by non-contiguous KV-cache memory allocation?',
      options: [
        'Eliminates internal and external memory fragmentation caused by dynamic sequence lengths',
        'Avoids computing attention weights entirely by quantizing KV vectors to 1-bit',
        'Compresses token embeddings by truncating context window size dynamically',
        'Replaces PyTorch CUDA kernels with CPU thread pools for zero-copy memory access',
      ],
      correctIndex: 0,
      explanation: 'PagedAttention borrows virtual memory paging from operating systems to store KV cache blocks in non-contiguous physical memory, reducing wasted VRAM fragmentation from 60-80% down to under 4%.',
    },
    {
      id: 'q-vllm-2',
      question: 'When deploying tensor-parallel LLM inference across 4x A100 GPUs using Megatron-style parallelization, which communication primitive is executed in the attention forward pass?',
      codeSnippet: `// ColumnParallelLinear -> RowParallelLinear
// Attention heads split across ranks:
Y = AllReduce(RowParallelLinear(Attention(ColumnParallelLinear(X))))`,
      options: [
        'All-Gather in the MLP layer, followed by All-To-All in Attention',
        'All-Reduce across tensor-parallel ranks after the RowParallel projection',
        'Point-to-point Send/Recv between GPU 0 and GPU 3',
        'Broadcast from Rank 0 to all other ranks after each layer normalization',
      ],
      correctIndex: 1,
      explanation: 'Megatron-LM uses ColumnParallelLinear for QKV projections, computes attention independently per GPU, and executes an All-Reduce after the RowParallel output projection to sum partial results across ranks.',
    },
    {
      id: 'q-vllm-3',
      question: 'What is the primary trade-off when configuring continuous batching (iteration-level scheduling) versus static request batching?',
      options: [
        'Static batching achieves lower GPU memory bandwidth utilization than continuous batching',
        'Continuous batching increases prompt processing latency for incoming requests but massively boosts token generation throughput',
        'Continuous batching eliminates KV caching entirely for prefill phases',
        'Continuous batching requires identical prompt lengths for all incoming clients',
      ],
      correctIndex: 1,
      explanation: 'Continuous batching schedules tokens at every iteration rather than waiting for entire batches to finish, keeping GPUs saturated at the expense of slight prefill scheduling overhead.',
    },
    {
      id: 'q-vllm-4',
      question: 'Why does FP8 (Float8) KV-cache quantization allow doubling batch sizes without significant perplexity degradation?',
      options: [
        'E4M3 format preserves sufficient dynamic range for key and value activations while halving cache byte width from 16 to 8 bits',
        'FP8 removes attention softmax normalizations in the decoder blocks',
        'FP8 enables 32-bit float accumulators to run without Tensor Cores',
        'FP8 forces all keys to zero if attention weight falls below 0.05',
      ],
      correctIndex: 0,
      explanation: 'FP8 (specifically E4M3 or E5M2) cuts KV cache footprint from 2 bytes per element (FP16/BF16) to 1 byte, doubling available block slots in GPU VRAM with minimal numerical drift.',
    },
    {
      id: 'q-vllm-5',
      question: 'In speculative decoding for high-throughput inference, what condition determines whether candidate tokens from a draft model are accepted?',
      codeSnippet: `// Rejection sampling criterion:
accept_prob = min(1.0, P_target(x) / P_draft(x))`,
      options: [
        'Tokens are accepted if target model logits are strictly positive',
        'Candidate tokens are accepted via rejection sampling comparing target model probability to draft model probability',
        'Draft tokens are accepted only if greedy argmax matches exactly across both models',
        'Draft tokens are verified by executing a cross-validation pass on CPU',
      ],
      correctIndex: 1,
      explanation: 'Speculative decoding verifies draft tokens in parallel on the target model using rejection sampling, guaranteeing identical output distribution to standard target model generation.',
    },
  ],

  // CUDA Kernel Optimization
  'sk-found-1': [
    {
      id: 'q-cuda-1',
      question: 'What causes memory warp divergence and uncoalesced global memory transactions on NVIDIA Ampere/Hopper architectures?',
      options: [
        'Consecutive threads within a 32-thread warp accessing non-consecutive or strided global memory addresses across multiple 32-byte cache lines',
        'Threads using `__shared__` memory arrays with power-of-two padding',
        'Excessive use of register variables overflowing into L1 cache',
        'Calling `__syncthreads()` inside uniform loop constructs',
      ],
      correctIndex: 0,
      explanation: 'When adjacent threads in a warp access non-contiguous memory, the hardware must issue multiple separate 32-byte memory transactions, drastically decreasing effective memory throughput.',
    },
    {
      id: 'q-cuda-2',
      question: 'Consider the following CUDA kernel snippet. What severe performance hazard is present?',
      codeSnippet: `__shared__ float s_data[32][32];
int tid = threadIdx.x;
// Thread 'tid' accesses column 0:
float val = s_data[tid][0];`,
      options: [
        '32-way shared memory bank conflict because all 32 threads in the warp map to Bank 0',
        'Deadlock caused by missing `__threadfence()`',
        'Out-of-bounds array access on the block boundary',
        'Warp divergence in the instruction dispatcher',
      ],
      correctIndex: 0,
      explanation: 'Shared memory has 32 banks (4 bytes each). In a column access `s_data[tid][0]`, each thread accesses an element with stride 32*4 bytes, which maps every single thread in the warp to Bank 0, causing a 32-way serializing bank conflict.',
    },
    {
      id: 'q-cuda-3',
      question: 'Why does OpenAI Triton simplify writing high-performance GPU kernels compared to raw CUDA C++?',
      options: [
        'Triton operates at block-level abstractions, automating memory coalescing, shared memory tiling, and warp-level scheduling through an MLIR compiler',
        'Triton converts Python code directly into JavaScript WebGPU shaders',
        'Triton eliminates the need for GPU VRAM by storing intermediate buffers on host NVMe',
        'Triton only executes on Intel CPU AVX-512 extensions',
      ],
      correctIndex: 0,
      explanation: 'Triton allows developers to write block-level program logic while its compiler backend automatically generates optimal shared memory layouts, vectorized loads, and pipelined instructions.',
    },
    {
      id: 'q-cuda-4',
      question: 'In modern FlashAttention implementations, how is the intermediate N×N attention matrix avoided from being written to high-bandwidth global memory (HBM)?',
      options: [
        'By tiling Q, K, and V into shared memory (SRAM) and computing online softmax incrementally using the Welford-style scaling algorithm',
        'By performing attention exclusively via Fast Fourier Transforms',
        'By discarding negative keys prior to matrix multiplication',
        'By replacing dot-product attention with L1 distance matrices',
      ],
      correctIndex: 0,
      explanation: 'FlashAttention uses online softmax to fuse GEMM operations into SRAM blocks, avoiding the expensive O(N^2) memory read/write cycles to HBM.',
    },
    {
      id: 'q-cuda-5',
      question: 'What is the purpose of Double Buffering (asynchronous copy `cp.async`) in Ampere/Hopper CUDA kernels?',
      options: [
        'Overlaps asynchronous data transfer from global memory to shared memory directly with Tensor Core arithmetic operations on the current tile',
        'Duplicates GPU framebuffers to prevent tearing during video rendering',
        'Synchronizes host CPU memory with remote clusters via TCP sockets',
        'Forces the GPU to clock down frequency to save thermal budget',
      ],
      correctIndex: 0,
      explanation: '`cp.async` bypasses registers to copy directly from global memory to shared memory, allowing the thread block to compute on tile N while loading tile N+1 in the background.',
    },
  ],

  // Quantitative Order Book / Low Latency
  'sk-quant-found-1': [
    {
      id: 'q-quant-1',
      question: 'In a microsecond-latency limit order book (LOB), why is a doubly linked list combined with a B-tree or array index preferred for price level management?',
      options: [
        'Provides O(1) order insertion and cancellation at a specific price level while maintaining O(log N) or O(1) best-bid/best-ask order priority',
        'Guarantees memory is automatically garbage collected without deallocation',
        'Allows multithreaded locks on individual price ticks without CPU cache invalidation',
        'Replaces network UDP packets with shared memory pointers across exchange colos',
      ],
      correctIndex: 0,
      explanation: 'Orders at the same price queue by time priority in an O(1) doubly-linked list, while the price ladder is indexed via a contiguous array or dense B-tree for fast best-bid-offer lookups.',
    },
    {
      id: 'q-quant-2',
      question: 'When transmitting market data over high-frequency networks, what protocol technique minimizes packet serialization and kernel overhead?',
      options: [
        'Kernel-bypass networking (e.g., Solarflare OpenOnload or DPDK) with raw UDP multicast and binary SBE (Simple Binary Encoding)',
        'REST API JSON polling over TLS 1.3 with keep-alive headers',
        'GraphQL queries batched through an HTTP/2 proxy',
        'WebSockets compressed with gzip over TCP',
      ],
      correctIndex: 0,
      explanation: 'Colocated quantitative infrastructure uses kernel-bypass (Solarflare EF_VI / DPDK) to read raw multicast UDP packets directly into userspace without OS kernel context switches.',
    },
    {
      id: 'q-quant-3',
      question: 'What metric measures the risk that an automated market maker executes with a counterparty possessing superior immediate alpha?',
      options: [
        'Adverse Selection (or VPIN - Volume-Synchronized Probability of Toxicity)',
        'Sharpe Ratio annualized over 252 trading days',
        'Calmar Ratio on maximum drawdown duration',
        'Value at Risk (VaR) at 99% 10-day horizon',
      ],
      correctIndex: 0,
      explanation: 'Adverse selection occurs when passive quotes are filled right before price moves adversely, indicating informed traders or toxic flow.',
    },
    {
      id: 'q-quant-4',
      question: 'What is the primary danger of lock contention in a C++ multi-threaded trading engine, and how is it eliminated?',
      options: [
        'Thread sleeping on mutexes causes unpredictable 5-20µs OS context switches; eliminated using single-writer lock-free ring buffers (Disruptor pattern)',
        'Locks cause memory leaks in the heap allocator',
        'Locks disable CPU hyperthreading permanently',
        'Mutexes prevent compiler loop unrolling optimizations',
      ],
      correctIndex: 0,
      explanation: 'Lock contention yields CPU cores to the scheduler, causing unacceptable latency spikes. Ultra-low latency engines use lock-free circular queues with CPU cache-line padding.',
    },
    {
      id: 'q-quant-5',
      question: 'In statistical arbitrage, how is cointegration between two asset price series mathematically distinguished from simple correlation?',
      codeSnippet: `// Engle-Granger 2-step test:
y_t = alpha + beta * x_t + epsilon_t
// Stationary check: ADF(epsilon_t)`,
      options: [
        'Cointegration requires a stationary linear combination of non-stationary series, ensuring mean-reverting spread over time',
        'Cointegration means the Pearson correlation coefficient is strictly equal to 1.0',
        'Cointegration applies only to intraday tick volume, not price levels',
        'Cointegration is calculated by summing daily returns without normalization',
      ],
      correctIndex: 0,
      explanation: 'Correlation measures co-movement over short windows, while cointegration proves a long-run equilibrium spread where residuals are stationary (mean-reverting).',
    },
  ],
};

/**
 * Returns a robust 5-question technical quiz for any skill in any roadmap.
 * If a pre-compiled quiz is available for the skill ID or name, returns it;
 * otherwise synthetically generates domain-specific questions based on the skill metadata.
 */
export function getQuizForSkill(skill: SkillCompetency, roadmapTitle: string): SkillQuizQuestion[] {
  // Check exact ID match
  if (CURATED_SKILL_QUIZZES[skill.id]) {
    return CURATED_SKILL_QUIZZES[skill.id];
  }

  // Check matching name keywords
  const skillNameLower = skill.name.toLowerCase();
  for (const [id, questions] of Object.entries(CURATED_SKILL_QUIZZES)) {
    if (
      (skillNameLower.includes('vllm') || skillNameLower.includes('inference') || skillNameLower.includes('serving')) &&
      id === 'sk-core-2'
    ) {
      return questions;
    }
    if (
      (skillNameLower.includes('cuda') || skillNameLower.includes('kernel') || skillNameLower.includes('gpu')) &&
      id === 'sk-found-1'
    ) {
      return questions;
    }
    if (
      (skillNameLower.includes('order book') || skillNameLower.includes('quant') || skillNameLower.includes('latency')) &&
      id === 'sk-quant-found-1'
    ) {
      return questions;
    }
  }

  // Generate high-quality contextual technical questions for this skill
  const topics = skill.keyTopics && skill.keyTopics.length > 0
    ? skill.keyTopics
    : ['System Design', 'Performance Optimization', 'Failure Modes', 'Core Invariants'];

  const t1 = topics[0] || 'Core Principles';
  const t2 = topics[1] || 'Architectural Patterns';
  const t3 = topics[2] || 'Production Bottlenecks';
  const t4 = topics[3] || 'Scalability Standards';

  return [
    {
      id: `gen-${skill.id}-1`,
      question: `In a production ${roadmapTitle} environment, what is the primary architectural invariant when deploying ${skill.name}?`,
      options: [
        `Strict adherence to deterministic bounds and validated state transitions for ${t1}`,
        `Offloading all state management to unindexed distributed key-value storage`,
        `Allowing unbounded retry loops without backoff or rate-limiting guarantees`,
        `Executing synchronous blocking RPCs on the hot data path without timeouts`,
      ],
      correctIndex: 0,
      explanation: `Production systems governing ${skill.name} require explicit deterministic contracts and bounded recovery invariants rather than unconstrained synchronous loops.`,
    },
    {
      id: `gen-${skill.id}-2`,
      question: `When optimizing ${skill.name} for high-throughput workloads, which trade-off directly governs system efficiency?`,
      codeSnippet: `// System Performance Constraint in ${skill.name}:
Latency_p99 = QueuingDelay(t) + ProcessingDelay(t) + SerializationCost`,
      options: [
        `Batching increases raw throughput while introducing bounded tail latency for ${t2}`,
        `Increasing thread concurrency always eliminates memory contention`,
        `Disabling serialization protocols reduces network wire efficiency`,
        `Using garbage-collected runtimes guarantees zero latency jitter`,
      ],
      correctIndex: 0,
      explanation: `Batching aggregates work units to amortize fixed transmission overhead, boosting overall throughput at the cost of slight queuing latency.`,
    },
    {
      id: `gen-${skill.id}-3`,
      question: `Which failure mode is most commonly encountered in ${skill.name} under sustained peak load?`,
      options: [
        `Resource exhaustion caused by cascading backpressure failures around ${t3}`,
        `Deterministic deadlocks in purely immutable read paths`,
        `Instantaneous memory corruption without pointer dereferencing`,
        `Loss of network connection during purely local in-memory operations`,
      ],
      correctIndex: 0,
      explanation: `Under heavy load, upstream systems that lack backpressure propagate unbounded queue buildup, resulting in memory saturation and latency degradation.`,
    },
    {
      id: `gen-${skill.id}-4`,
      question: `How is data integrity and verified correctness proven when implementing ${t4} within ${skill.name}?`,
      options: [
        `Idempotent execution with automated invariants checking and structured telemetry`,
        `Blind optimistic updates without conflict resolution protocols`,
        `Relying on manual code reviews without automated regression testing`,
        `Logging unstructured text strings to local files without structured metrics`,
      ],
      correctIndex: 0,
      explanation: `Enterprise verification requires idempotency, automated property-based invariant testing, and structured observability metrics.`,
    },
    {
      id: `gen-${skill.id}-5`,
      question: `When presenting your implementation of ${skill.name} in an advanced technical interview, what design decision best demonstrates senior competence?`,
      options: [
        `Articulating quantitative benchmark trade-offs between memory footprint, latency budgets, and operational complexity`,
        `Claiming the architecture has zero trade-offs and infinite scalability`,
        `Using external third-party libraries without understanding their underlying data structures`,
        `Omitting disaster recovery and graceful degradation strategies`,
      ],
      correctIndex: 0,
      explanation: `Hiring managers and staff engineers evaluate candidate mastery by their ability to quantify trade-offs, defend architectural choices, and anticipate failure modes.`,
    },
  ];
}
