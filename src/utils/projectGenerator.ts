/**
 * AI Portfolio Project Generator
 * Crafts end-to-end production-grade portfolio projects for missing skills to bridge competence gaps.
 */

import { JobRoadmap, SkillCompetency, PortfolioProject } from '../types/roadmap';

export const CURATED_PROJECT_BLUEPRINTS: Record<string, Partial<PortfolioProject>> = {
  // vLLM / Distributed Inference
  'sk-core-2': {
    projectTitle: 'FlashServe: Distributed Tensor-Parallel LLM Inference Gateway',
    tagline: 'High-throughput LLM serving engine featuring continuous batching, PagedAttention KV-caching, and FP8 quantization.',
    difficulty: 'Advanced',
    estimatedHours: 45,
    problemStatement: 'Vanilla transformer inference runtimes suffer from up to 75% GPU memory fragmentation and severe latency spikes under concurrent user requests. FlashServe implements virtual memory paging for KV tensors and iteration-level continuous batching to maximize hardware saturation.',
    techStack: ['Python 3.11', 'PyTorch 2.4', 'vLLM', 'OpenAI Triton', 'FastAPI', 'Ray Core', 'Prometheus', 'Grafana'],
    architectureOverview: `┌─────────────────────────────────────────────────────────────┐
│ 1. Client Requests (HTTP / Server-Sent Events Streaming)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Continuous Batching Queue (Iteration-Level Scheduler)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. PagedAttention Memory Manager (Block-level KV allocation)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Tensor-Parallel Worker Pool (Ray Actors on 2-4x GPUs)    │
└─────────────────────────────────────────────────────────────┘`,
    milestones: [
      {
        step: 1,
        title: 'Continuous Batch Scheduler & Tokenizer Pipeline',
        deliverable: 'Async queue managing prefill vs decode stages at per-token iteration boundaries.',
        acceptanceCriteria: 'Demonstrate zero GPU idle time during simultaneous short and long prompts.',
      },
      {
        step: 2,
        title: 'Paged KV-Cache Memory Allocator',
        deliverable: 'Custom memory manager dividing KV tensors into non-contiguous 16-token memory blocks.',
        acceptanceCriteria: 'Reduce VRAM fragmentation from 65% to < 5% on 8k context length prompts.',
      },
      {
        step: 3,
        title: 'Streaming SSE API Gateway with Prometheus Metrics',
        deliverable: 'FastAPI streaming endpoint returning tokens via Server-Sent Events with TTFT telemetry.',
        acceptanceCriteria: 'Report Time-To-First-Token (TTFT) < 35ms and Inter-Token-Latency (ITL) < 18ms.',
      },
      {
        step: 4,
        title: 'Benchmarking Suite vs Baseline Runtimes',
        deliverable: 'Automated locust/wrk load test comparing FlashServe against vanilla HuggingFace TGI.',
        acceptanceCriteria: 'Achieve at least 3.8x higher throughput (tokens/sec) under 50 concurrent streams.',
      },
    ],
    datasetsOrApis: [
      { name: 'Meta Llama-3-8B-Instruct (HuggingFace)', description: 'Primary model weights for tensor parallel benchmarking' },
      { name: 'ShareGPT 90k Conversation Traces', description: 'Real-world prompt length distribution for realistic latency profiling' },
      { name: 'Prometheus Node Exporter & vLLM Metrics', description: 'Real-time telemetry for GPU memory, TTFT, and queue depth' },
    ],
    interviewTalkingPoints: [
      'Engineered an iteration-level scheduler that reduced tail latency (p99) by 62% under heavy token bursts.',
      'Designed an asynchronous Ray Actor topology across multiple GPUs, profiling AllReduce NCCL collective communication overhead.',
      'Implemented FP8 dynamic scaling, doubling maximum concurrent batch capacity on NVIDIA Ada/Hopper architectures.',
      'Built a reproducible Dockerized CI benchmark testbed measuring exact TTFT and token generation throughput.',
    ],
  },

  // CUDA Optimization
  'sk-found-1': {
    projectTitle: 'CuKernel-Opt: Fused Attention & Flash-GEMM Operator Library',
    tagline: 'Hardware-tuned CUDA & OpenAI Triton kernel library with shared memory tiling and zero bank conflicts.',
    difficulty: 'Pinnacle',
    estimatedHours: 55,
    problemStatement: 'Standard deep learning frameworks waste significant memory bandwidth on intermediate activations during elementwise and matrix operations. CuKernel-Opt provides custom fused kernels achieving > 85% of theoretical peak FP16 TFLOPS.',
    techStack: ['CUDA C++ (C++20)', 'NVIDIA Nsight Compute (NCU)', 'OpenAI Triton', 'PyTorch C++ Extensions', 'CMake'],
    architectureOverview: `┌─────────────────────────────────────────────────────────────┐
│ Host: PyTorch Tensor Inputs (Row-Major FP16)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ Asynchronous Host-to-Device cp.async
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Device: Warp-Level Shared Memory Tiling (128x128 Tile)      │
│ - Swizzled shared memory layout avoiding 32-way bank conflicts │
│ - Double-buffered asynchronous copy pipeline (Ampere cp.async) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Tensor Core HMMA Instructions (m16n8k16 FP16 Multiply-Add)  │
└─────────────────────────────────────────────────────────────┘`,
    milestones: [
      {
        step: 1,
        title: 'Tiled Matrix Multiplication with Shared Memory',
        deliverable: 'CUDA C++ GEMM kernel utilizing 2D thread block tiling and vector loads (float4).',
        acceptanceCriteria: 'Demonstrate 100% memory coalescing via NVIDIA Nsight Compute profile.',
      },
      {
        step: 2,
        title: 'Bank Conflict Elimination via XOR Swizzling',
        deliverable: 'Shared memory indexing algorithm preventing bank collisions during transposition.',
        acceptanceCriteria: 'NCU report confirming 0 bank conflicts on L1/Shared Memory.',
      },
      {
        step: 3,
        title: 'Online Softmax Fused Attention in Triton',
        deliverable: 'Custom Triton kernel fusing Softmax + Matrix Multiply without writing intermediate NxN matrices.',
        acceptanceCriteria: 'Match or exceed standard PyTorch SDPA execution speed on sequence lengths 2048-8192.',
      },
      {
        step: 4,
        title: 'PyTorch C++ Binding & PyPI Distribution',
        deliverable: 'Ready-to-install Python extension packaged with automated unit regression tests.',
        acceptanceCriteria: 'Numerical verification confirming all outputs match torch.matmul within 1e-4 tolerance.',
      },
    ],
    datasetsOrApis: [
      { name: 'Synthetic FP16 Matrix Suite (N=1024 to 16384)', description: 'Comprehensive dimensional sweep for compute vs memory bound profiling' },
      { name: 'Nsight Compute CLI (ncu)', description: 'Profiling hardware memory throughput, SM occupancy, and pipeline stalls' },
    ],
    interviewTalkingPoints: [
      'Identified and resolved a 32-way shared memory bank conflict using XOR address swizzling, recovering 4.2x kernel speedup.',
      'Implemented double-buffering with Ampere cp.async, completely hiding memory latency behind Tensor Core math.',
      'Defended memory-bound vs compute-bound roofline analysis during architecture discussions with senior hardware engineers.',
    ],
  },
};

/**
 * Generates a full GitHub README.md markdown starter for a project
 */
export function generateProjectReadme(project: PortfolioProject): string {
  return `# ${project.projectTitle}

> **${project.tagline}**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/downloads/)
[![Status](https://img.shields.io/badge/status-${project.status}-emerald.svg)](#)
[![Difficulty](https://img.shields.io/badge/level-${project.difficulty}-purple.svg)](#)

---

## 📌 Executive Summary

**Problem Statement:**  
${project.problemStatement}

**Primary Objective:**  
Provide a production-grade, highly defensive implementation demonstrating verified competence in **${project.targetSkillName}**.

---

## 🛠 Tech Stack

${project.techStack.map(tech => `- \`${tech}\``).join('\n')}

---

## 🏗 Architecture & Data Flow

\`\`\`
${project.architectureOverview}
\`\`\`

---

## 🚀 Key Implementation Milestones

${project.milestones
  .map(
    m => `### Phase ${m.step}: ${m.title}
- **Deliverable**: ${m.deliverable}
- **Acceptance Criteria**: ${m.acceptanceCriteria}
`
  )
  .join('\n')}

---

## 📊 Datasets & Reference Sources

${project.datasetsOrApis.map(d => `- **${d.name}**: ${d.description}${d.url ? ` ([Link](${d.url}))` : ''}`).join('\n')}

---

## 🎯 Interview Talking Points (Hiring Manager Defense)

${project.interviewTalkingPoints.map(point => `- ${point}`).join('\n')}

---

## 💻 Quick Start & Setup

\`\`\`bash
# 1. Clone this repository
git clone https://github.com/your-username/${project.id}.git
cd ${project.id}

# 2. Set up virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run verification benchmark
python -m pytest tests/
python run_benchmarks.py
\`\`\`

---

*Reverse-Engineered via [PathFinder Career Architecture Engine](https://pathfinder.app)*
`;
}

/**
 * Generates or builds a concrete portfolio project for a specific target skill
 */
export function generatePortfolioProjectForSkill(
  skill: SkillCompetency,
  roadmap: JobRoadmap
): PortfolioProject {
  const blueprint = CURATED_PROJECT_BLUEPRINTS[skill.id];

  const projectId = `proj-${skill.id}-${Date.now().toString(36)}`;
  const title = blueprint?.projectTitle || `Production ${skill.name} Engine`;
  const tagline = blueprint?.tagline || `Enterprise-grade implementation and automated benchmarking for ${skill.name}.`;
  const difficulty = (blueprint?.difficulty || (skill.tierLevel <= 1 ? 'Pinnacle' : 'Advanced')) as 'Intermediate' | 'Advanced' | 'Pinnacle';
  const estimatedHours = blueprint?.estimatedHours || skill.estimatedHoursToBridge || 40;
  const problemStatement = blueprint?.problemStatement || `Organizations adopting ${roadmap.title} require robust, production-tested solutions for ${skill.name}. This project provides a battle-hardened architectural implementation with automated regression testing and measurable performance telemetry.`;
  const techStack = blueprint?.techStack || [
    'Python 3.11',
    'TypeScript',
    'Docker',
    'FastAPI',
    'Redis',
    'Prometheus',
    'GitHub Actions CI',
  ];
  const architectureOverview = blueprint?.architectureOverview || `[Client Ingestion] -> [High-Throughput Validation Queue] -> [Core ${skill.name} Processing Node] -> [Deterministic Storage & Telemetry]`;
  const milestones = blueprint?.milestones || [
    {
      step: 1,
      title: `Core Architectural Scaffolding for ${skill.name}`,
      deliverable: `Initial decoupled prototype implementing core interfaces and deterministic state handling.`,
      acceptanceCriteria: `100% test coverage on foundational logic with zero flaky runs.`,
    },
    {
      step: 2,
      title: `Performance Optimization & Concurrency Scaling`,
      deliverable: `Vectorized execution, cache optimization, and parallel worker orchestration.`,
      acceptanceCriteria: `Demonstrate sub-10ms processing latency under simulated load spikes.`,
    },
    {
      step: 3,
      title: `Observability, Telemetry & Failure Recovery`,
      deliverable: `Prometheus instrumentation, structured JSON logging, and automated fault recovery.`,
      acceptanceCriteria: `Zero state leakage during forced worker crash simulations.`,
    },
    {
      step: 4,
      title: `Comprehensive Benchmarking & Documentation`,
      deliverable: `Reproducible benchmark script and employer-facing portfolio README.`,
      acceptanceCriteria: `Publish reproducible figures demonstrating superior throughput vs unoptimized baseline.`,
    },
  ];
  const datasetsOrApis = blueprint?.datasetsOrApis || [
    { name: `Domain Reference Dataset for ${skill.name}`, description: `Realistic synthetic workload profile for stress testing.` },
    { name: `Prometheus Metrics Exporter`, description: `Real-time latency, memory consumption, and throughput metrics.` },
  ];
  const interviewTalkingPoints = blueprint?.interviewTalkingPoints || [
    `Quantified the engineering trade-offs between computational overhead and architectural maintainability for ${skill.name}.`,
    `Demonstrated production resilience by designing explicit backpressure and graceful degradation protocols.`,
    `Authored a comprehensive test suite covering edge cases and deterministic boundary conditions.`,
  ];

  const draft: PortfolioProject = {
    id: projectId,
    targetSkillId: skill.id,
    targetSkillName: skill.name,
    roadmapId: roadmap.id,
    projectTitle: title,
    tagline,
    difficulty,
    estimatedHours,
    problemStatement,
    techStack,
    architectureOverview,
    milestones,
    datasetsOrApis,
    githubReadmeTemplate: '',
    interviewTalkingPoints,
    status: 'idea',
  };

  draft.githubReadmeTemplate = generateProjectReadme(draft);
  return draft;
}
