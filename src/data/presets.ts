const RAW_PRESETS: any[] = [
  // 1. AI Engineer
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    slug: 'ai-engineer',
    industry: 'Artificial Intelligence & Generative Systems',
    summary: 'Architects and scales production Generative AI applications, autonomous multi-agent systems, enterprise Retrieval-Augmented Generation (RAG) pipelines, model fine-tuning (LoRA/QLoRA), and high-throughput low-latency inference serving infrastructure.',
    targetHorizon: '12 Months',
    salaryRange: '$165,000 - $250,000 / yr',
    marketDemand: 'Hyper-Growth (+74% YoY)',
    requiredDegreeOrEquivalent: 'B.S. / M.S. or equivalent in Computer Science, Software Engineering, or related STEM',
    keyResponsibilities: [
      'Architect production RAG systems with hybrid vector search, reciprocal rank fusion, and semantic reranking',
      'Design autonomous multi-agent reasoning workflows with tool use, structured JSON schemas, and state persistence',
      'Fine-tune domain-specific foundational models using parameter-efficient fine-tuning (PEFT/LoRA) and DPO',
      'Optimize high-concurrency LLM inference latency and token economics using vLLM, TensorRT-LLM, and caching'
    ],
    stages: [
      {
        id: 'stage-ai-1',
        stageIndex: 1,
        title: 'Phase 1: Deep Learning Foundations & Transformer Architecture',
        timeframe: 'Months 1 - 3',
        objective: 'Master PyTorch tensor computations, backpropagation calculus, multi-head self-attention mechanisms, and Hugging Face tokenizers.',
        milestones: [
          {
            id: 'ms-ai-1',
            stageId: 'stage-ai-1',
            title: 'Build a Decoder-Only Transformer from Scratch in PyTorch',
            description: 'Implement scaled dot-product attention, positional encodings, causally-masked multi-head attention, and feedforward blocks with zero high-level library abstraction.',
            status: 'achieved',
            difficulty: 'Foundational',
            targetTimeframe: 'Month 2',
            deliverables: [
              'Clean PyTorch module implementing causal self-attention and RMSNorm',
              'Training script verifying character-level Shakespeare language generation',
              'Loss curve convergence visualization under cross-entropy loss'
            ],
            completedDeliverables: [
              'Clean PyTorch module implementing causal self-attention and RMSNorm',
              'Training script verifying character-level Shakespeare language generation',
              'Loss curve convergence visualization under cross-entropy loss'
            ],
            linkedSkillIds: ['skill-ai-transformers', 'skill-ai-deep-learning'],
            completedAt: '2026-01-15'
          },
          {
            id: 'ms-ai-2',
            stageId: 'stage-ai-1',
            title: 'Deploy Tokenization & Embeddings Pipeline',
            description: 'Implement BPE/WordPiece tokenization analysis and build vector similarity search over 100,000 documents with Cosine/HNSW indexing.',
            status: 'achieved',
            difficulty: 'Intermediate',
            targetTimeframe: 'Month 3',
            deliverables: [
              'Benchmark comparing SentenceTransformers embedding inference latency',
              'HNSW indexing script with sub-10ms recall evaluation'
            ],
            completedDeliverables: [
              'Benchmark comparing SentenceTransformers embedding inference latency',
              'HNSW indexing script with sub-10ms recall evaluation'
            ],
            linkedSkillIds: ['skill-ai-transformers', 'skill-ai-rag-vector'],
            completedAt: '2026-02-20'
          }
        ]
      },
      {
        id: 'stage-ai-2',
        stageIndex: 2,
        title: 'Phase 2: Enterprise RAG Pipelines & Semantic Retrieval',
        timeframe: 'Months 4 - 6',
        objective: 'Engineer advanced chunking strategies, hybrid search (dense + BM25), metadata filtering, cross-encoder re-ranking, and context compression.',
        milestones: [
          {
            id: 'ms-ai-3',
            stageId: 'stage-ai-2',
            title: 'Production Multi-Modal RAG with Cross-Encoder Re-Ranking',
            description: 'Build enterprise knowledge retrieval over complex PDF tables and diagrams with Cohere/BGE re-ranking and hallucination guardrails.',
            status: 'in_progress',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 5',
            deliverables: [
              'Hybrid retrieval pipeline with reciprocal rank fusion (RRF)',
              'RAGAS evaluation suite demonstrating >0.85 faithfulness and answer relevancy',
              'Streaming response integration with citations and source verification'
            ],
            completedDeliverables: [
              'Hybrid retrieval pipeline with reciprocal rank fusion (RRF)'
            ],
            linkedSkillIds: ['skill-ai-rag-vector', 'skill-ai-llm-inference']
          }
        ]
      },
      {
        id: 'stage-ai-3',
        stageIndex: 3,
        title: 'Phase 3: Model Fine-Tuning & Parameter-Efficient Adaptation',
        timeframe: 'Months 7 - 9',
        objective: 'Execute QLoRA fine-tuning runs on open models (Llama 3 / Mistral), instruction tuning, format alignment, and preference optimization (DPO).',
        milestones: [
          {
            id: 'ms-ai-4',
            stageId: 'stage-ai-3',
            title: 'Domain QLoRA Fine-Tuning & Evaluation Benchmark',
            description: 'Fine-tune an 8B instruction model with 4-bit quantization on custom domain corpora; evaluate with benchmark test harnesses.',
            status: 'not_started',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 8',
            deliverables: [
              'Curated dataset of 5,000 instruction-response pairs with synthetic validation',
              'Axolotl/Unsloth training configuration with WandB loss telemetry',
              'Model evaluation showing +25% domain accuracy gain over baseline'
            ],
            linkedSkillIds: ['skill-ai-finetuning', 'skill-ai-transformers']
          }
        ]
      },
      {
        id: 'stage-ai-4',
        stageIndex: 4,
        title: 'Phase 4: Autonomous Multi-Agent Workflows & High-Throughput Serving',
        timeframe: 'Months 10 - 12',
        objective: 'Construct multi-agent teams with tool-calling, state machines, self-correction, vLLM continuous batching, and production LLMOps monitoring.',
        milestones: [
          {
            id: 'ms-ai-5',
            stageId: 'stage-ai-4',
            title: 'Deploy Self-Reflective Multi-Agent System on vLLM Cluster',
            description: 'Architect a supervisor-worker agent system using LangGraph with human-in-the-loop triggers, tool sandboxes, and vLLM GPU inference.',
            status: 'not_started',
            difficulty: 'Pinnacle',
            targetTimeframe: 'Month 12',
            deliverables: [
              'LangGraph DAG with error recovery and persistent PostgreSQL checkpointing',
              'vLLM deployment serving 100 concurrent requests with PagedAttention',
              'OpenTelemetry tracing logging token usage, latency, and tool execution'
            ],
            linkedSkillIds: ['skill-ai-agentic-systems', 'skill-ai-llm-inference']
          }
        ]
      }
    ],
    skills: [
      {
        id: 'skill-ai-agentic-systems',
        name: 'Autonomous Multi-Agent Architecture',
        category: 'Generative AI Systems',
        currentLevel: 2,
        targetLevel: 5,
        verifiedLevel: 2,
        description: 'Building collaborative agent networks, tool-calling schemas, dynamic planning, reflection loops, and persistent state machines.',
        prerequisites: ['skill-ai-rag-vector', 'skill-ai-transformers'],
        keyTopics: ['LangGraph', 'ReAct Pattern', 'Tool Calling', 'Human-in-the-loop', 'Plan-and-Solve', 'Stateful Memory']
      },
      {
        id: 'skill-ai-finetuning',
        name: 'Model Fine-Tuning & Alignment (LoRA/DPO)',
        category: 'Model Adaptation',
        currentLevel: 1,
        targetLevel: 5,
        verifiedLevel: 1,
        description: 'Parameter-efficient fine-tuning with QLoRA, instruction tuning dataset preparation, Direct Preference Optimization, and reward modeling.',
        prerequisites: ['skill-ai-transformers', 'skill-ai-deep-learning'],
        keyTopics: ['QLoRA / PEFT', 'Dataset Synthetic Augmentation', 'DPO', 'Unsloth', 'Weights & Biases', 'Quantization (AWQ/GGUF)']
      },
      {
        id: 'skill-ai-rag-vector',
        name: 'Enterprise RAG & Vector Search',
        category: 'Information Retrieval',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Hierarchical chunking, dense and sparse retrieval fusion, cross-encoder reranking, graph RAG, and context caching.',
        prerequisites: ['skill-ai-transformers'],
        keyTopics: ['Qdrant / Milvus / Pinecone', 'BM25 + Dense Hybrid', 'Cross-Encoders', 'RAGAS Evaluation', 'Context Compression']
      },
      {
        id: 'skill-ai-llm-inference',
        name: 'High-Throughput LLM Inference (vLLM)',
        category: 'Infrastructure & Serving',
        currentLevel: 2,
        targetLevel: 4,
        verifiedLevel: 2,
        description: 'Optimizing token generation throughput, continuous batching, PagedAttention, speculative decoding, and TensorRT-LLM containerization.',
        prerequisites: ['skill-ai-transformers'],
        keyTopics: ['vLLM', 'PagedAttention', 'Speculative Decoding', 'Triton Inference Server', 'Token Budgeting', 'GPU Memory Profiles']
      },
      {
        id: 'skill-ai-transformers',
        name: 'Transformer Architecture & Attention Mechanisms',
        category: 'Core AI Theory',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Mathematical mechanics of self-attention, multi-query attention, rotary position embeddings (RoPE), KV-cache dynamics, and transformer blocks.',
        prerequisites: ['skill-ai-deep-learning', 'skill-ai-linear-algebra'],
        keyTopics: ['Multi-Head Attention', 'RoPE Encodings', 'KV Cache Mechanics', 'FlashAttention', 'Tokenizer Byte-Pair Encodings']
      },
      {
        id: 'skill-ai-deep-learning',
        name: 'Deep Learning with PyTorch',
        category: 'Foundational AI',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Backpropagation, custom loss functions, automatic differentiation (autograd), PyTorch Lightning, and GPU tensor computing.',
        prerequisites: ['skill-ai-linear-algebra', 'skill-ai-python-engineering'],
        keyTopics: ['PyTorch Autograd', 'Loss Functions', 'Optimizer Algorithms (AdamW)', 'DataLoader Pipelines', 'Distributed Data Parallel']
      },
      {
        id: 'skill-ai-linear-algebra',
        name: 'Applied Linear Algebra & Matrix Calculus',
        category: 'Mathematical Foundations',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Vector spaces, matrix decomposition (SVD, Eigenvalues), gradient descent calculus, and probabilistic distributions.',
        prerequisites: [],
        keyTopics: ['Singular Value Decomposition', 'Matrix Factorization', 'Gradient Calculus', 'Softmax Optimization', 'Probability Distributions']
      },
      {
        id: 'skill-ai-python-engineering',
        name: 'Advanced Python & Async Systems',
        category: 'Software Engineering',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'High-performance Python, asynchronous programming with asyncio, FastAPI streaming endpoints, and pydantic schema validation.',
        prerequisites: [],
        keyTopics: ['Asyncio / Concurrency', 'FastAPI WebSockets & SSE', 'Pydantic V2', 'Type Annotations', 'Pytest Suite']
      }
    ],
    certifications: [
      {
        id: 'cert-ai-1',
        title: 'Deep Learning Specialization',
        issuer: 'DeepLearning.AI / Coursera',
        issueDate: '2025-11-10',
        credentialId: 'DL-SPEC-98214',
        fileName: 'deep_learning_spec_andrew_ng.pdf',
        fileSize: '410 KB',
        mimeType: 'application/pdf',
        linkedSkillIds: ['skill-ai-deep-learning', 'skill-ai-transformers'],
        verified: true,
        uploadedAt: '2026-01-10'
      }
    ],
    recommendedCertifications: [
      {
        id: 'rec-ai-1',
        name: 'AWS Certified Machine Learning - Specialty',
        issuer: 'Amazon Web Services',
        estimatedCost: '$300',
        relevance: 'Demonstrates cloud-scale model training and deployment competency on enterprise infrastructure.',
        linkedSkillIds: ['skill-ai-llm-inference']
      }
    ],
    createdAt: '2026-01-01',
    lastUpdated: '2026-03-15'
  },

  // 2. ML Engineer
  {
    id: 'ml-engineer',
    title: 'ML Engineer',
    slug: 'ml-engineer',
    industry: 'Machine Learning Platforms & MLOps',
    summary: 'Bridges data science research and production software engineering by constructing automated model training pipelines, distributed GPU training clusters, feature stores, model registries, real-time inference endpoints, and automated drift monitoring.',
    targetHorizon: '12 Months',
    salaryRange: '$155,000 - $235,000 / yr',
    marketDemand: 'High Demand (+52% YoY)',
    requiredDegreeOrEquivalent: 'B.S. / M.S. in Computer Science, Data Science, or Mathematics',
    keyResponsibilities: [
      'Architect automated continuous training and validation pipelines with Kubeflow and MLflow',
      'Scale distributed training across multi-node GPU clusters using PyTorch FSDP and Ray Train',
      'Deploy low-latency model inference microservices with Triton Inference Server and ONNX Runtime',
      'Monitor production model metrics, data distribution shifts, feature drift, and operational telemetry'
    ],
    stages: [
      {
        id: 'stage-ml-1',
        stageIndex: 1,
        title: 'Phase 1: Feature Engineering & Classical Machine Learning',
        timeframe: 'Months 1 - 3',
        objective: 'Master scikit-learn pipelines, gradient boosting (XGBoost/LightGBM), feature engineering, and cross-validation methodologies.',
        milestones: [
          {
            id: 'ms-ml-1',
            stageId: 'stage-ml-1',
            title: 'End-to-End Tabular Model with Automated Feature Pipeline',
            description: 'Construct a production predictive model on millions of records with automated imputation, target encoding, and hyperparameter tuning.',
            status: 'achieved',
            difficulty: 'Foundational',
            targetTimeframe: 'Month 2',
            deliverables: [
              'Custom Scikit-Learn transformers for robust feature pipelines',
              'Optuna Bayesian hyperparameter search optimization script',
              'SHAP explainability dashboard displaying feature attributions'
            ],
            completedDeliverables: [
              'Custom Scikit-Learn transformers for robust feature pipelines',
              'Optuna Bayesian hyperparameter search optimization script'
            ],
            linkedSkillIds: ['skill-ml-classical-models', 'skill-ml-feature-engineering'],
            completedAt: '2026-01-28'
          }
        ]
      },
      {
        id: 'stage-ml-2',
        stageIndex: 2,
        title: 'Phase 2: Distributed Training & Large-Scale Data Ingestion',
        timeframe: 'Months 4 - 6',
        objective: 'Implement distributed training across multiple GPUs with PyTorch DDP/FSDP and Ray, optimizing data loaders and IO bottlenecks.',
        milestones: [
          {
            id: 'ms-ml-2',
            stageId: 'stage-ml-2',
            title: 'Multi-GPU Distributed Training Pipeline with Ray Train',
            description: 'Scale model training to 4x GPU cluster with mixed-precision training (FP16/BF16) and gradient checkpointing.',
            status: 'in_progress',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 5',
            deliverables: [
              'Ray Train script with fault-tolerant checkpointing and resumption',
              'GPU utilization profiling report achieving >92% SM compute saturation'
            ],
            completedDeliverables: [],
            linkedSkillIds: ['skill-ml-distributed-training', 'skill-ml-docker-k8s']
          }
        ]
      },
      {
        id: 'stage-ml-3',
        stageIndex: 3,
        title: 'Phase 3: Automated MLOps & CI/CD Pipelines',
        timeframe: 'Months 7 - 9',
        objective: 'Implement CI/CD workflows for machine learning: automated testing, dataset versioning with DVC, and model registry governance with MLflow.',
        milestones: [
          {
            id: 'ms-ml-3',
            stageId: 'stage-ml-3',
            title: 'Automated Kubeflow Pipeline with Model Registry Promotion',
            description: 'Build a GitOps-driven ML pipeline that triggers training on data updates, benchmarks against baseline, and promotes to staging.',
            status: 'not_started',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 8',
            deliverables: [
              'Kubeflow YAML pipeline definitions with containerized steps',
              'Automated gating tests verifying minimum F1 score and latency',
              'MLflow Model Registry integration with automated webhooks'
            ],
            linkedSkillIds: ['skill-ml-pipeline-orchestration', 'skill-ml-docker-k8s']
          }
        ]
      },
      {
        id: 'stage-ml-4',
        stageIndex: 4,
        title: 'Phase 4: Low-Latency Inference Serving & Production Monitoring',
        timeframe: 'Months 10 - 12',
        objective: 'Deploy models on Triton Inference Server with dynamic batching, ONNX optimization, and real-time drift detection with Evidently AI.',
        milestones: [
          {
            id: 'ms-ml-4',
            stageId: 'stage-ml-4',
            title: 'Triton Production Serving with Prometheus Drift Telemetry',
            description: 'Deploy ensemble model on Triton with dynamic batching, sub-15ms p99 response times, and real-time data drift alarms.',
            status: 'not_started',
            difficulty: 'Pinnacle',
            targetTimeframe: 'Month 12',
            deliverables: [
              'Triton model repository configuration with dynamic batching enabled',
              'Prometheus and Grafana dashboards tracking Kolmogorov-Smirnov drift stats',
              'Automated rollback protocol triggered on latency or accuracy regression'
            ],
            linkedSkillIds: ['skill-ml-inference-serving', 'skill-ml-monitoring-drift']
          }
        ]
      }
    ],
    skills: [
      {
        id: 'skill-ml-distributed-training',
        name: 'Distributed Model Training (FSDP / Ray)',
        category: 'High Performance Computing',
        currentLevel: 2,
        targetLevel: 5,
        verifiedLevel: 2,
        description: 'Multi-GPU and multi-node scaling, Fully Sharded Data Parallel (FSDP), Ray Train, gradient accumulation, and mixed precision.',
        prerequisites: ['skill-ml-classical-models', 'skill-ml-docker-k8s'],
        keyTopics: ['PyTorch DDP / FSDP', 'Ray Train & Tune', 'Mixed Precision (AMP)', 'IO Bottleneck Profiling', 'NCCL Communication']
      },
      {
        id: 'skill-ml-inference-serving',
        name: 'Production Inference Serving (Triton / ONNX)',
        category: 'Model Serving',
        currentLevel: 2,
        targetLevel: 5,
        verifiedLevel: 2,
        description: 'Deploying high-concurrency model endpoints, dynamic batching, TensorRT acceleration, ONNX Runtime, and gRPC communication.',
        prerequisites: ['skill-ml-classical-models', 'skill-ml-docker-k8s'],
        keyTopics: ['Triton Inference Server', 'ONNX Runtime', 'Dynamic Batching', 'gRPC Endpoints', 'Sub-20ms SLA Optimization']
      },
      {
        id: 'skill-ml-pipeline-orchestration',
        name: 'ML Pipeline Orchestration (Kubeflow / MLflow)',
        category: 'MLOps',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Reproducible training DAGs, artifact tracking, experiment management, model registries, and GitOps integration.',
        prerequisites: ['skill-ml-docker-k8s', 'skill-ml-classical-models'],
        keyTopics: ['Kubeflow Pipelines', 'MLflow Registry', 'DVC Data Versioning', 'GitHub Actions for ML', 'Model Lineage']
      },
      {
        id: 'skill-ml-feature-engineering',
        name: 'Feature Engineering & Real-Time Stores',
        category: 'Data Architecture',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Online and offline feature store architectures (Feast), streaming feature computation with Kafka, and point-in-time correctness.',
        prerequisites: ['skill-ml-data-engineering'],
        keyTopics: ['Feast Feature Store', 'Point-in-Time Joins', 'Streaming Aggregations', 'Target Encoding', 'Feature Consistency']
      },
      {
        id: 'skill-ml-monitoring-drift',
        name: 'Model Monitoring & Data Drift Detection',
        category: 'Production Reliability',
        currentLevel: 2,
        targetLevel: 4,
        verifiedLevel: 2,
        description: 'Detecting covariate shift, concept drift, prediction drift, Prometheus metric export, and automated alerting.',
        prerequisites: ['skill-ml-classical-models'],
        keyTopics: ['Evidently AI', 'Prometheus & Grafana', 'KS-Test & PSI Statistics', 'Data Quality Profiling', 'Incident Response Playbooks']
      },
      {
        id: 'skill-ml-classical-models',
        name: 'Statistical Learning & Classical ML',
        category: 'Foundational ML',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Supervised and unsupervised algorithms, tree ensembles (XGBoost/LightGBM), regularization, and cross-validation strategies.',
        prerequisites: ['skill-ml-data-engineering'],
        keyTopics: ['XGBoost / LightGBM', 'Hyperparameter Tuning (Optuna)', 'Cross-Validation Strategies', 'ROC-AUC & F1 Metrics', 'Model Explainability (SHAP)']
      },
      {
        id: 'skill-ml-docker-k8s',
        name: 'Containerization & Kubernetes for ML',
        category: 'Infrastructure',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Docker containerization of GPU workloads, Kubernetes deployments, PVC storage mounts, and Helm charts.',
        prerequisites: [],
        keyTopics: ['NVIDIA Container Toolkit', 'Kubernetes Pods & Jobs', 'Persistent Volumes', 'Helm Package Manager', 'Resource Quotas']
      },
      {
        id: 'skill-ml-data-engineering',
        name: 'High-Performance Data Processing',
        category: 'Data Engineering',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Processing big datasets using SQL, Polars, and Apache Spark, managing parquet storage, and optimizing queries.',
        prerequisites: [],
        keyTopics: ['Polars & DuckDB', 'Apache Spark / PySpark', 'Parquet / Arrow Formats', 'Window Functions & Aggregations', 'Data Partitioning']
      }
    ],
    certifications: [
      {
        id: 'cert-ml-1',
        title: 'Machine Learning Engineering for Production (MLOps)',
        issuer: 'DeepLearning.AI',
        issueDate: '2025-10-14',
        credentialId: 'MLOPS-77341',
        fileName: 'mlops_specialization_cert.pdf',
        fileSize: '320 KB',
        mimeType: 'application/pdf',
        linkedSkillIds: ['skill-ml-pipeline-orchestration', 'skill-ml-monitoring-drift'],
        verified: true,
        uploadedAt: '2026-01-20'
      }
    ],
    recommendedCertifications: [
      {
        id: 'rec-ml-1',
        name: 'Google Cloud Professional Machine Learning Engineer',
        issuer: 'Google Cloud',
        estimatedCost: '$200',
        relevance: 'Industry standard certification for architecting ML pipelines and scalable deployments on cloud infrastructure.',
        linkedSkillIds: ['skill-ml-pipeline-orchestration', 'skill-ml-inference-serving']
      }
    ],
    createdAt: '2026-01-05',
    lastUpdated: '2026-03-10'
  },

  // 3. Quant Engineer
  {
    id: 'quant-engineer',
    title: 'Quant Engineer',
    slug: 'quant-engineer',
    industry: 'Quantitative Finance & High-Frequency Trading',
    summary: 'Designs and builds ultra-low-latency algorithmic trading infrastructure, order execution engines, tick-by-tick market data handlers, statistical arbitrage backtesters, and high-throughput financial risk platforms in modern C++.',
    targetHorizon: '12 Months',
    salaryRange: '$220,000 - $380,000 / yr',
    marketDemand: 'Elite Frontier (+45% YoY)',
    requiredDegreeOrEquivalent: 'B.S. / M.S. in Computer Science, Financial Engineering, Physics, or Mathematics',
    keyResponsibilities: [
      'Build lock-free C++ trading execution systems with sub-microsecond tick-to-trade response times',
      'Implement market data feed parsers (FIX, ITCH, OUCH) with kernel-bypass networking (Solarflare OpenOnload / DPDK)',
      'Architect event-driven vectorized backtesting engines processing petabyte-scale tick data',
      'Optimize cache locality, SIMD vectorization, memory-mapped ring buffers, and CPU thread pinning'
    ],
    stages: [
      {
        id: 'stage-qe-1',
        stageIndex: 1,
        title: 'Phase 1: Modern C++ & Cache-Conscious Systems Programming',
        timeframe: 'Months 1 - 3',
        objective: 'Master Modern C++20, RAII, memory-mapped I/O, cache line alignment, CPU branch prediction, and lock-free ring buffers.',
        milestones: [
          {
            id: 'ms-qe-1',
            stageId: 'stage-qe-1',
            title: 'Build Zero-Allocation Lock-Free SPSC Queue in C++20',
            description: 'Implement a cache-aligned single-producer single-consumer circular buffer with memory fences achieving >50M msgs/sec.',
            status: 'achieved',
            difficulty: 'Intermediate',
            targetTimeframe: 'Month 2',
            deliverables: [
              'Header-only C++20 queue with memory alignment to 64-byte cache lines',
              'Google Benchmark suite measuring latency under 15 nanoseconds',
              'ThreadSanitizer validation confirming zero data races'
            ],
            completedDeliverables: [
              'Header-only C++20 queue with memory alignment to 64-byte cache lines',
              'Google Benchmark suite measuring latency under 15 nanoseconds',
              'ThreadSanitizer validation confirming zero data races'
            ],
            linkedSkillIds: ['skill-quant-ultra-low-latency', 'skill-quant-modern-cpp'],
            completedAt: '2026-02-05'
          }
        ]
      },
      {
        id: 'stage-qe-2',
        stageIndex: 2,
        title: 'Phase 2: Market Microstructure, Order Books & Exchange Protocols',
        timeframe: 'Months 4 - 6',
        objective: 'Implement high-speed Limit Order Book (LOB) matching engines, NASDAQ ITCH multicast feeds, and OUCH execution handlers.',
        milestones: [
          {
            id: 'ms-qe-2',
            stageId: 'stage-qe-2',
            title: 'Sub-Microsecond Limit Order Book with ITCH 5.0 Feed Handler',
            description: 'Parse raw binary NASDAQ ITCH 5.0 packet captures and maintain price-time priority order book depth with sub-microsecond latency.',
            status: 'in_progress',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 5',
            deliverables: [
              'Zero-copy binary protocol parser decoding 5M packets/sec',
              'Flat-array order book with O(1) best bid/offer updates',
              'Determinism verification against official exchange tick feeds'
            ],
            completedDeliverables: [
              'Zero-copy binary protocol parser decoding 5M packets/sec'
            ],
            linkedSkillIds: ['skill-quant-market-microstructure', 'skill-quant-ultra-low-latency']
          }
        ]
      },
      {
        id: 'stage-qe-3',
        stageIndex: 3,
        title: 'Phase 3: Kernel-Bypass Networking & Hardware Acceleration',
        timeframe: 'Months 7 - 9',
        objective: 'Eliminate Linux kernel network stack overhead using Solarflare OpenOnload, AF_XDP, and DPDK user-space polling.',
        milestones: [
          {
            id: 'ms-qe-3',
            stageId: 'stage-qe-3',
            title: 'Kernel-Bypass UDP Multicast Receiver with AF_XDP',
            description: 'Implement zero-copy packet ingestion directly into userspace memory buffers bypassing the Linux socket layer.',
            status: 'not_started',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 8',
            deliverables: [
              'AF_XDP socket driver reading from dedicated network interface card queue',
              'Core pinning and isolcpus benchmark confirming zero OS interrupt jitter',
              'Packet drop rate of 0% under burst line rates of 10 Gbps'
            ],
            linkedSkillIds: ['skill-quant-kernel-bypass', 'skill-quant-linux-internals']
          }
        ]
      },
      {
        id: 'stage-qe-4',
        stageIndex: 4,
        title: 'Phase 4: Algorithmic Backtesting Engines & Real-Time Risk Checks',
        timeframe: 'Months 10 - 12',
        objective: 'Construct event-driven backtesting engines processing historical nanosecond order books with pre-trade risk controls and fill simulation.',
        milestones: [
          {
            id: 'ms-qe-4',
            stageId: 'stage-qe-4',
            title: 'Event-Driven Vectorized Backtester with Pre-Trade Risk Checks',
            description: 'Architect a backtesting framework supporting strategy simulation with realistic queue position modeling and exchange latencies.',
            status: 'not_started',
            difficulty: 'Pinnacle',
            targetTimeframe: 'Month 12',
            deliverables: [
              'C++ backtest engine capable of simulating 1 full year of tick data in under 2 minutes',
              'Sub-50 nanosecond pre-trade risk validation module (fat-finger, notional limits)',
              'Python binding layer (pybind11) enabling strategy research in Jupyter'
            ],
            linkedSkillIds: ['skill-quant-backtesting-engine', 'skill-quant-stochastic-calculus']
          }
        ]
      }
    ],
    skills: [
      {
        id: 'skill-quant-ultra-low-latency',
        name: 'Ultra-Low Latency C++ & Lock-Free Design',
        category: 'Systems Architecture',
        currentLevel: 3,
        targetLevel: 5,
        verifiedLevel: 3,
        description: 'Zero-allocation execution, lock-free data structures, memory fences, atomic primitives, and CPU cache-line optimization.',
        prerequisites: ['skill-quant-modern-cpp', 'skill-quant-linux-internals'],
        keyTopics: ['Lock-Free Ring Buffers', 'std::atomic & Memory Ordering', 'False Sharing Elimination', 'SIMD Vectorization', 'Zero-Copy Serialization']
      },
      {
        id: 'skill-quant-kernel-bypass',
        name: 'Kernel Bypass Networking (Solarflare / DPDK)',
        category: 'Networking Systems',
        currentLevel: 1,
        targetLevel: 5,
        verifiedLevel: 1,
        description: 'Bypassing the OS network stack for direct NIC-to-user-space packet transfers via Solarflare OpenOnload, AF_XDP, and DPDK.',
        prerequisites: ['skill-quant-linux-internals', 'skill-quant-modern-cpp'],
        keyTopics: ['Solarflare OpenOnload', 'AF_XDP Sockets', 'DPDK Ring Buffers', 'Multicast UDP Feed Ingestion', 'Hardware Timestamping']
      },
      {
        id: 'skill-quant-market-microstructure',
        name: 'Limit Order Book Dynamics & Exchange Protocols',
        category: 'Financial Engineering',
        currentLevel: 2,
        targetLevel: 4,
        verifiedLevel: 2,
        description: 'Price-time priority matching engines, NASDAQ ITCH/OUCH, CME MDP 3.0, queue position modeling, and market impact.',
        prerequisites: ['skill-quant-modern-cpp'],
        keyTopics: ['Limit Order Book (LOB) Architecture', 'ITCH 5.0 Multicast Decoding', 'OUCH Execution Orders', 'Cross-Exchange Arbitrage Mechanics']
      },
      {
        id: 'skill-quant-backtesting-engine',
        name: 'Event-Driven Backtesting & Simulation Engines',
        category: 'Trading Infrastructure',
        currentLevel: 2,
        targetLevel: 4,
        verifiedLevel: 2,
        description: 'Simulating trading strategies over historical tick data with realistic queue position modeling and execution latency simulation.',
        prerequisites: ['skill-quant-modern-cpp', 'skill-quant-stochastic-calculus'],
        keyTopics: ['Discrete Event Simulation', 'Tick-by-Tick Data Replay', 'Slippage & Queue Simulation', 'Pybind11 Python C++ Bridges']
      },
      {
        id: 'skill-quant-stochastic-calculus',
        name: 'Quantitative Math & Stochastic Calculus',
        category: 'Mathematical Foundations',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Stochastic differential equations, Ito calculus, Black-Scholes-Merton model, Monte Carlo simulation, and statistical arbitrage.',
        prerequisites: [],
        keyTopics: ['Ito Calculus & Brownian Motion', 'Monte Carlo Methods', 'Pairs Trading & Mean Reversion', 'GARCH Volatility Modeling', 'Sharpe & Sortino Metrics']
      },
      {
        id: 'skill-quant-modern-cpp',
        name: 'Modern C++20/23 Systems Programming',
        category: 'Programming Languages',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'C++20 concepts, coroutines, constexpr metaprogramming, move semantics, custom allocators, and memory profiling.',
        prerequisites: [],
        keyTopics: ['C++20 Concepts & Ranges', 'Template Metaprogramming', 'Custom Memory Allocators', 'Valgrind & Perf Profiling', 'AddressSanitizer']
      },
      {
        id: 'skill-quant-linux-internals',
        name: 'Linux Kernel Performance & CPU Pinning',
        category: 'Operating Systems',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'CPU core pinning, isolcpus boot flags, scheduler preemption tuning, huge pages, and interrupt request (IRQ) affinity.',
        prerequisites: [],
        keyTopics: ['Core Affinity & taskset', 'Transparent Huge Pages (THP)', 'IRQ Affinity Balancing', 'Perf & FlameGraphs', 'NUMA Node Topology']
      },
      {
        id: 'skill-quant-financial-instruments',
        name: 'Financial Instruments & Market Risk Foundations',
        category: 'Financial Foundations',
        currentLevel: 3,
        targetLevel: 3,
        verifiedLevel: 3,
        description: 'Equities, futures, vanilla and exotic options, swap contracts, margin calculations, and pre-trade risk controls.',
        prerequisites: [],
        keyTopics: ['Futures Margin & Settlement', 'Option Greeks (Delta, Gamma, Vega)', 'Value at Risk (VaR)', 'Pre-Trade Notional Risk Limits']
      }
    ],
    certifications: [
      {
        id: 'cert-qe-1',
        title: 'C++ Nanodegree: High-Performance Systems',
        issuer: 'Udacity',
        issueDate: '2025-08-12',
        credentialId: 'CPP-HP-3091',
        fileName: 'cpp_systems_certification.pdf',
        fileSize: '290 KB',
        mimeType: 'application/pdf',
        linkedSkillIds: ['skill-quant-modern-cpp', 'skill-quant-ultra-low-latency'],
        verified: true,
        uploadedAt: '2026-01-15'
      }
    ],
    recommendedCertifications: [
      {
        id: 'rec-qe-1',
        name: 'Certificate in Quantitative Finance (CQF)',
        issuer: 'CQF Institute',
        estimatedCost: '$20,000',
        relevance: 'Prestigious credential in quantitative trading, derivatives pricing, and stochastic calculus.',
        linkedSkillIds: ['skill-quant-stochastic-calculus', 'skill-quant-backtesting-engine']
      }
    ],
    createdAt: '2026-01-02',
    lastUpdated: '2026-03-12'
  },

  // 4. Professor
  {
    id: 'professor',
    title: 'Professor',
    slug: 'professor',
    industry: 'Higher Education & Academic Research',
    summary: 'Leads innovative scientific and technological research labs, secures multi-million dollar federal grants (NSF/NIH/DARPA), authors peer-reviewed publications, designs undergraduate and graduate curricula, mentors doctoral candidates, and contributes to academic university governance.',
    targetHorizon: '12 Months',
    salaryRange: '$120,000 - $210,000 / yr',
    marketDemand: 'Steady Academic Prestige (+18% YoY)',
    requiredDegreeOrEquivalent: 'Ph.D. in Computer Science, Engineering, or Natural Sciences',
    keyResponsibilities: [
      'Publish high-impact scholarly research in leading peer-reviewed journals and conferences',
      'Act as Principal Investigator (PI) securing competitive external research funding',
      'Design university curricula, deliver engaging lectures, and advise Ph.D. and master thesis students',
      'Serve on academic peer-review panels, university tenure committees, and international symposia boards'
    ],
    stages: [
      {
        id: 'stage-prof-1',
        stageIndex: 1,
        title: 'Phase 1: Research Methodology & Scholarly Publication',
        timeframe: 'Months 1 - 3',
        objective: 'Conduct rigorous academic literature reviews, formulate novel research hypotheses, and author conference papers.',
        milestones: [
          {
            id: 'ms-prof-1',
            stageId: 'stage-prof-1',
            title: 'Draft & Submit Peer-Reviewed Research Paper',
            description: 'Execute novel experimental benchmark and complete full academic manuscript with IEEE/ACM formatting.',
            status: 'achieved',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 3',
            deliverables: [
              'Comprehensive literature review citing 40+ seminal papers',
              'Rigorous experimental evaluation with statistical significance testing',
              'Final manuscript submitted to flagship international conference'
            ],
            completedDeliverables: [
              'Comprehensive literature review citing 40+ seminal papers',
              'Rigorous experimental evaluation with statistical significance testing',
              'Final manuscript submitted to flagship international conference'
            ],
            linkedSkillIds: ['skill-prof-research-methodology', 'skill-prof-peer-review'],
            completedAt: '2026-02-14'
          }
        ]
      },
      {
        id: 'stage-prof-2',
        stageIndex: 2,
        title: 'Phase 2: Federal Grant Writing & Funding Strategy',
        timeframe: 'Months 4 - 6',
        objective: 'Develop competitive federal grant proposals (NSF CAREER, NIH R01) complete with budgets and broader impact statements.',
        milestones: [
          {
            id: 'ms-prof-2',
            stageId: 'stage-prof-2',
            title: 'Complete Full NSF / Agency Grant Proposal Package',
            description: 'Write 15-page project description, broader impacts statement, budget justification, and institutional facilities documentation.',
            status: 'in_progress',
            difficulty: 'Pinnacle',
            targetTimeframe: 'Month 5',
            deliverables: [
              '15-page research narrative with preliminary feasibility data',
              'Broader impacts plan integrating underrepresented student outreach',
              'Detailed 3-year research budget breakdown and equipment justifications'
            ],
            completedDeliverables: [
              '15-page research narrative with preliminary feasibility data'
            ],
            linkedSkillIds: ['skill-prof-grant-writing', 'skill-prof-research-methodology']
          }
        ]
      },
      {
        id: 'stage-prof-3',
        stageIndex: 3,
        title: 'Phase 3: Graduate Curriculum Design & Socratic Pedagogy',
        timeframe: 'Months 7 - 9',
        objective: 'Architect university course syllabus, design advanced laboratory assignments, and develop rubric assessment criteria.',
        milestones: [
          {
            id: 'ms-prof-3',
            stageId: 'stage-prof-3',
            title: 'Design Full Semester Graduate Course Syllabus & Labs',
            description: 'Create a 14-week graduate curriculum with weekly lecture slides, coding projects, and grading rubrics.',
            status: 'not_started',
            difficulty: 'Intermediate',
            targetTimeframe: 'Month 8',
            deliverables: [
              'Comprehensive syllabus mapped to accreditation learning outcomes',
              'Five hands-on programming assignments with automated grading test suites',
              'Guest lecture seminar schedule featuring industry researchers'
            ],
            linkedSkillIds: ['skill-prof-curriculum-design', 'skill-prof-academic-speaking']
          }
        ]
      },
      {
        id: 'stage-prof-4',
        stageIndex: 4,
        title: 'Phase 4: Lab Leadership, Ph.D. Advising & Academic Tenure File',
        timeframe: 'Months 10 - 12',
        objective: 'Establish research laboratory protocols, mentor doctoral researchers, and assemble dossier for academic promotion.',
        milestones: [
          {
            id: 'ms-prof-4',
            stageId: 'stage-prof-4',
            title: 'Assemble Comprehensive Academic Tenure & Teaching Portfolio',
            description: 'Compile research statement, teaching philosophy dossier, student evaluations, and external letters of recommendation.',
            status: 'not_started',
            difficulty: 'Pinnacle',
            targetTimeframe: 'Month 12',
            deliverables: [
              'Executive Research Statement articulating 5-year laboratory roadmap',
              'Teaching Statement incorporating evidence-based pedagogical innovations',
              'Lab mentorship charter defining student publication expectations'
            ],
            linkedSkillIds: ['skill-prof-doctoral-advising', 'skill-prof-grant-writing']
          }
        ]
      }
    ],
    skills: [
      {
        id: 'skill-prof-grant-writing',
        name: 'Federal Grant Proposal & Funding Acquisition',
        category: 'Research Leadership',
        currentLevel: 2,
        targetLevel: 5,
        verifiedLevel: 2,
        description: 'Writing winning proposals for NSF, NIH, DARPA, or foundation grants, budget planning, and articulating broader societal impacts.',
        prerequisites: ['skill-prof-research-methodology', 'skill-prof-scientific-writing'],
        keyTopics: ['NSF Proposal Mechanics', 'Budget Justifications', 'Broader Impacts Architecture', 'Preliminary Data Generation', 'Grant Review Panel Criteria']
      },
      {
        id: 'skill-prof-doctoral-advising',
        name: 'Doctoral Advising & Lab Management',
        category: 'Academic Mentorship',
        currentLevel: 2,
        targetLevel: 5,
        verifiedLevel: 2,
        description: 'Mentoring Ph.D. students, dissertation guidance, research laboratory culture, research computing budgeting, and ethics.',
        prerequisites: ['skill-prof-research-methodology'],
        keyTopics: ['Dissertation Committee Guidance', 'Research Integrity & Ethics', 'Student Authorship Standards', 'Lab Computing Clusters', 'Lab Onboarding Protocols']
      },
      {
        id: 'skill-prof-curriculum-design',
        name: 'Curriculum Architecture & University Pedagogy',
        category: 'Higher Education',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Designing undergraduate and graduate syllabi, Bloom taxonomy learning objectives, project-based assignments, and rubrics.',
        prerequisites: ['skill-prof-academic-speaking'],
        keyTopics: ['Bloom Taxonomy Alignment', 'Flipped Classroom Methods', 'Automated Grading Frameworks', 'ABET Accreditation Criteria']
      },
      {
        id: 'skill-prof-peer-review',
        name: 'Academic Peer Review & Editorial Governance',
        category: 'Scholarly Publishing',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Serving as conference program committee member, reviewing journal submissions, editorial decisions, and publication ethics.',
        prerequisites: ['skill-prof-scientific-writing'],
        keyTopics: ['Blind Peer Review Standards', 'Meta-Review Author Feedback', 'Journal Impact Factor Metrics', 'Conflict of Interest Guidelines']
      },
      {
        id: 'skill-prof-research-methodology',
        name: 'Rigorous Research Methodology & Experimental Design',
        category: 'Scientific Method',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Hypothesis testing, rigorous baseline benchmarks, statistical ablation studies, and reproducible science practices.',
        prerequisites: ['skill-prof-domain-mastery'],
        keyTopics: ['Controlled Baseline Experiments', 'Ablation Study Designs', 'Statistical Hypothesis Testing', 'Reproducibility & Open Science']
      },
      {
        id: 'skill-prof-academic-speaking',
        name: 'Scholarly Keynote & University Lecturing',
        category: 'Communication',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Delivering compelling 50-minute lectures, keynote symposium addresses, and moderating scholarly panel debates.',
        prerequisites: [],
        keyTopics: ['Lecture Pacing & Visual Slides', 'Conference Keynote Delivery', 'Socratic Questioning Technique', 'Audience Engagement Mechanics']
      },
      {
        id: 'skill-prof-scientific-writing',
        name: 'Scientific Literature Review & Manuscript Writing',
        category: 'Communication',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Authoring clear, precise scholarly prose in LaTeX, structured abstracts, mathematical proofs, and literature reviews.',
        prerequisites: [],
        keyTopics: ['LaTeX Document Typesetting', 'BibTeX Citation Organization', 'Clear Academic Argumentation', 'Figure and Table Layouts']
      },
      {
        id: 'skill-prof-domain-mastery',
        name: 'Specialized Disciplinary Domain Epistemology',
        category: 'Disciplinary Core',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Deep foundational mastery of mathematical principles, foundational theory, and current cutting-edge literature in your field.',
        prerequisites: [],
        keyTopics: ['Theoretical Frameworks', 'Seminal Literature Corpus', 'Open Conjectures & Unsolved Problems', 'Interdisciplinary Connections']
      }
    ],
    certifications: [
      {
        id: 'cert-prof-1',
        title: 'Higher Education Teaching & Pedagogy Certificate',
        issuer: 'Center for Teaching & Learning Excellence',
        issueDate: '2025-06-18',
        credentialId: 'UNIV-PED-4412',
        fileName: 'university_teaching_certificate.pdf',
        fileSize: '350 KB',
        mimeType: 'application/pdf',
        linkedSkillIds: ['skill-prof-curriculum-design', 'skill-prof-academic-speaking'],
        verified: true,
        uploadedAt: '2026-01-11'
      }
    ],
    recommendedCertifications: [
      {
        id: 'rec-prof-1',
        name: 'NSF Grants Conference Workshop Completion',
        issuer: 'National Science Foundation',
        estimatedCost: '$150',
        relevance: 'Comprehensive training directly from NSF program directors on successful proposal formulation.',
        linkedSkillIds: ['skill-prof-grant-writing']
      }
    ],
    createdAt: '2026-01-08',
    lastUpdated: '2026-03-14'
  },

  // 5. Teacher
  {
    id: 'teacher',
    title: 'Teacher',
    slug: 'teacher',
    industry: 'K-12 Education & STEM Pedagogy',
    summary: 'Inspires and educates students through engaging instructional design, state educational standards alignment (AP / NextGen Science), hands-on STEM project-based labs, differentiated learning accommodations, classroom management, and positive learning culture.',
    targetHorizon: '12 Months',
    salaryRange: '$58,000 - $95,000 / yr',
    marketDemand: 'High Societal Need (+22% YoY)',
    requiredDegreeOrEquivalent: 'B.S. / B.A. in Education, Computer Science, or Subject Area with State Teaching Licensure',
    keyResponsibilities: [
      'Design and deliver engaging daily lesson plans aligned with state and national educational standards',
      'Differentiate instructional delivery for neurodiverse students, IEPs, and English Language Learners',
      'Facilitate hands-on science and coding labs, project exhibitions, and robotics club activities',
      'Foster positive restorative classroom culture, character building, and regular parent-guardian communication'
    ],
    stages: [
      {
        id: 'stage-teach-1',
        stageIndex: 1,
        title: 'Phase 1: Instructional Planning & Educational Standards Alignment',
        timeframe: 'Months 1 - 3',
        objective: 'Master lesson design frameworks (5E Model, Understanding by Design), state standards alignment, and formative assessments.',
        milestones: [
          {
            id: 'ms-teach-1',
            stageId: 'stage-teach-1',
            title: 'Design Standards-Aligned 4-Week STEM Unit Plan',
            description: 'Develop a comprehensive 4-week instructional unit with daily lesson objectives, materials list, and formative check-ins.',
            status: 'achieved',
            difficulty: 'Foundational',
            targetTimeframe: 'Month 2',
            deliverables: [
              'Backward-designed unit plan mapped directly to state standards',
              'Daily bellringer check-ins and exit tickets measuring concept mastery',
              'Differentiated modifications for emerging readers and advanced students'
            ],
            completedDeliverables: [
              'Backward-designed unit plan mapped directly to state standards',
              'Daily bellringer check-ins and exit tickets measuring concept mastery'
            ],
            linkedSkillIds: ['skill-teach-instructional-design', 'skill-teach-formative-assessment'],
            completedAt: '2026-01-30'
          }
        ]
      },
      {
        id: 'stage-teach-2',
        stageIndex: 2,
        title: 'Phase 2: Differentiated Learning & Special Needs Accommodations',
        timeframe: 'Months 4 - 6',
        objective: 'Implement accommodations for Individualized Education Plans (IEP), 504 plans, English learners, and gifted students.',
        milestones: [
          {
            id: 'ms-teach-2',
            stageId: 'stage-teach-2',
            title: 'IEP Accommodation Matrix & Universal Design Strategy',
            description: 'Build Universal Design for Learning (UDL) lesson adaptations ensuring full accessibility across diverse cognitive profiles.',
            status: 'in_progress',
            difficulty: 'Intermediate',
            targetTimeframe: 'Month 5',
            deliverables: [
              'Accommodation matrix integrating visual scaffolds, audio aids, and tactile tools',
              'Case study analysis with progress monitoring documentation',
              'Collaborative co-teaching protocol with special education staff'
            ],
            completedDeliverables: [
              'Accommodation matrix integrating visual scaffolds, audio aids, and tactile tools'
            ],
            linkedSkillIds: ['skill-teach-differentiated-learning', 'skill-teach-instructional-design']
          }
        ]
      },
      {
        id: 'stage-teach-3',
        stageIndex: 3,
        title: 'Phase 3: Hands-On Project-Based Learning & STEM Labs',
        timeframe: 'Months 7 - 9',
        objective: 'Conduct inquiry-based science experiments, hands-on coding challenges (Python/Scratch), and student engineering showcases.',
        milestones: [
          {
            id: 'ms-teach-3',
            stageId: 'stage-teach-3',
            title: 'Execute Schoolwide Interactive STEM Maker Challenge',
            description: 'Lead a student engineering design challenge where student teams prototype solutions to real-world community problems.',
            status: 'not_started',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 8',
            deliverables: [
              'Hands-on lab safety guidelines and material allocation inventory',
              'Holistic rubric evaluating scientific inquiry, teamwork, and presentation',
              'Exhibition day program showcasing 20+ working student prototypes'
            ],
            linkedSkillIds: ['skill-teach-pbl-stem', 'skill-teach-classroom-management']
          }
        ]
      },
      {
        id: 'stage-teach-4',
        stageIndex: 4,
        title: 'Phase 4: Restorative Classroom Management & Parent Partnerships',
        timeframe: 'Months 10 - 12',
        objective: 'Establish proactive behavioral expectations, restorative justice practices, social-emotional learning, and family communication.',
        milestones: [
          {
            id: 'ms-teach-4',
            stageId: 'stage-teach-4',
            title: 'Classroom Management Plan & State Licensure Portfolio',
            description: 'Assemble complete state professional teaching portfolio including recorded lessons, student growth data, and community logs.',
            status: 'not_started',
            difficulty: 'Pinnacle',
            targetTimeframe: 'Month 12',
            deliverables: [
              'Proactive classroom culture playbook with clear routines and restorative steps',
              'Student academic growth analysis demonstrating positive value-added gains',
              'Parent engagement communication log and conference documentation'
            ],
            linkedSkillIds: ['skill-teach-classroom-management', 'skill-teach-communication-parental']
          }
        ]
      }
    ],
    skills: [
      {
        id: 'skill-teach-instructional-design',
        name: 'Pedagogical Instructional Design & Mapping',
        category: 'Core Pedagogy',
        currentLevel: 3,
        targetLevel: 5,
        verifiedLevel: 3,
        description: 'Backward curriculum mapping (UbD), 5E instructional cycle, aligning lessons with state educational standards, and objective setting.',
        prerequisites: ['skill-teach-foundational-pedagogy'],
        keyTopics: ['Understanding by Design (UbD)', '5E Lesson Cycle', 'State Learning Standards', 'Curriculum Pacing Guides', 'Scaffolding Strategies']
      },
      {
        id: 'skill-teach-differentiated-learning',
        name: 'Differentiated Learning & Accommodations (IEP/504)',
        category: 'Inclusion & Equity',
        currentLevel: 2,
        targetLevel: 5,
        verifiedLevel: 2,
        description: 'Universal Design for Learning (UDL), multimodal instruction, adapting content for IEP/504 accommodations and English Language Learners.',
        prerequisites: ['skill-teach-foundational-pedagogy'],
        keyTopics: ['Universal Design for Learning (UDL)', 'IEP / 504 Plan Compliance', 'ELL / ESL Language Supports', 'Tiered Assignment Options', 'Assistive Technologies']
      },
      {
        id: 'skill-teach-pbl-stem',
        name: 'Project-Based Learning (PBL) & STEM Labs',
        category: 'Active Learning',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Designing inquiry-driven science investigations, coding workshops (Python/Block programming), and maker design challenges.',
        prerequisites: ['skill-teach-instructional-design'],
        keyTopics: ['Engineering Design Process', 'Inquiry-Based Labs', 'Hands-On Robotics / Microcontrollers', 'Student Exhibition Scoring']
      },
      {
        id: 'skill-teach-classroom-management',
        name: 'Classroom Management & Restorative Culture',
        category: 'Classroom Culture',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Proactive routines, positive behavioral interventions and supports (PBIS), de-escalation tactics, and restorative dialogue.',
        prerequisites: [],
        keyTopics: ['PBIS Frameworks', 'Restorative Practices', 'Daily Transitions & Routines', 'De-escalation Strategies', 'Social-Emotional Learning (SEL)']
      },
      {
        id: 'skill-teach-formative-assessment',
        name: 'Formative & Summative Student Assessments',
        category: 'Measurement & Assessment',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Exit tickets, standards-based grading rubrics, diagnostic pre-tests, and data-driven instructional interventions.',
        prerequisites: ['skill-teach-instructional-design'],
        keyTopics: ['Standards-Based Grading', 'Rubric Construction', 'Quick Formative Exit Checks', 'Data-Driven Remediation Protocols']
      },
      {
        id: 'skill-teach-educational-technology',
        name: 'Educational Technology & Learning Platforms (LMS)',
        category: 'EdTech Tools',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Leveraging Google Classroom, Canvas, interactive whiteboards, quiz tools (Kahoot/Quizizz), and digital student portfolios.',
        prerequisites: [],
        keyTopics: ['Google Classroom / Canvas', 'Interactive Polling & Quiz Tools', 'Digital Student Portfolios', 'Online Safety & Digital Citizenship']
      },
      {
        id: 'skill-teach-communication-parental',
        name: 'Family Communication & Community Engagement',
        category: 'Stakeholder Relations',
        currentLevel: 3,
        targetLevel: 3,
        verifiedLevel: 3,
        description: 'Effective parent-teacher conferences, weekly newsletters, building trust with diverse families, and community partnerships.',
        prerequisites: [],
        keyTopics: ['Parent-Teacher Conference Strategies', 'Family Grade Telemetry', 'Culturally Responsive Communication', 'Community Mentorship Links']
      },
      {
        id: 'skill-teach-foundational-pedagogy',
        name: 'Educational Psychology & Cognitive Development',
        category: 'Theoretical Foundations',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Piaget and Vygotsky cognitive development stages, zone of proximal development, schema theory, and growth mindset principles.',
        prerequisites: [],
        keyTopics: ['Zone of Proximal Development', 'Cognitive Load Theory', 'Growth Mindset Psychology', 'Metacognition Coaching']
      }
    ],
    certifications: [
      {
        id: 'cert-teach-1',
        title: 'State Professional Educator Certification',
        issuer: 'State Department of Education',
        issueDate: '2025-05-15',
        credentialId: 'STATE-ED-88210',
        fileName: 'state_teaching_license.pdf',
        fileSize: '280 KB',
        mimeType: 'application/pdf',
        linkedSkillIds: ['skill-teach-instructional-design', 'skill-teach-classroom-management'],
        verified: true,
        uploadedAt: '2026-01-05'
      }
    ],
    recommendedCertifications: [
      {
        id: 'rec-teach-1',
        name: 'National Board Certification (NBPTS)',
        issuer: 'National Board for Professional Teaching Standards',
        estimatedCost: '$1,900',
        relevance: 'The gold standard credential recognizing accomplished teaching excellence and peer-reviewed instructional practice.',
        linkedSkillIds: ['skill-teach-instructional-design', 'skill-teach-differentiated-learning']
      }
    ],
    createdAt: '2026-01-07',
    lastUpdated: '2026-03-11'
  },

  // 6. Trainer
  {
    id: 'trainer',
    title: 'Trainer',
    slug: 'trainer',
    industry: 'Corporate Training & Workforce Development',
    summary: 'Designs, facilitates, and evaluates corporate learning and technical workforce enablement programs. Drives enterprise upskilling in AI, software engineering, cloud architecture, leadership development, interactive bootcamps, and measurable business ROI.',
    targetHorizon: '12 Months',
    salaryRange: '$85,000 - $145,000 / yr',
    marketDemand: 'Accelerating (+35% YoY)',
    requiredDegreeOrEquivalent: 'B.S. in Human Resources, Communications, Computer Science, or equivalent corporate experience',
    keyResponsibilities: [
      'Conduct organization-wide Training Needs Analysis (TNA) to identify critical workforce competency gaps',
      'Design corporate training curriculum using the ADDIE instructional model and microlearning units',
      'Facilitate interactive cohort-based bootcamps, executive workshops, and hands-on technical sandboxes',
      'Measure business impact, retention, and return on investment using the Kirkpatrick 4-Level Evaluation model'
    ],
    stages: [
      {
        id: 'stage-train-1',
        stageIndex: 1,
        title: 'Phase 1: Adult Learning Principles (Andragogy) & Needs Assessment',
        timeframe: 'Months 1 - 3',
        objective: 'Master Knowles adult learning theory, conduct corporate skill gap audits, and formulate measurable learning objectives.',
        milestones: [
          {
            id: 'ms-train-1',
            stageId: 'stage-train-1',
            title: 'Complete Enterprise Technical Training Needs Analysis (TNA)',
            description: 'Survey 200+ employees and interview department managers to identify exact skill deficits; deliver prioritized executive report.',
            status: 'achieved',
            difficulty: 'Intermediate',
            targetTimeframe: 'Month 2',
            deliverables: [
              'Quantitative skill gap survey dataset and statistical distribution',
              'Competency matrix mapping job roles to target proficiency benchmarks',
              'Executive presentation outlining proposed learning path curriculum'
            ],
            completedDeliverables: [
              'Quantitative skill gap survey dataset and statistical distribution',
              'Competency matrix mapping job roles to target proficiency benchmarks'
            ],
            linkedSkillIds: ['skill-train-andragogy-addie', 'skill-train-needs-analysis'],
            completedAt: '2026-02-02'
          }
        ]
      },
      {
        id: 'stage-train-2',
        stageIndex: 2,
        title: 'Phase 2: Interactive Courseware Design & Hands-On Sandboxes',
        timeframe: 'Months 4 - 6',
        objective: 'Develop interactive slide decks, hands-on cloud labs, scenario-based roleplays, and digital workbooks.',
        milestones: [
          {
            id: 'ms-train-2',
            stageId: 'stage-train-2',
            title: 'Build Cloud Sandbox Lab & 3-Day Technical Bootcamp',
            description: 'Architect self-paced interactive coding sandboxes with pre-configured development environments and verification scripts.',
            status: 'in_progress',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 5',
            deliverables: [
              'Interactive slide curriculum with engaging infographics and discussion prompts',
              'Browser-based sandbox environment with step-by-step lab exercises',
              'Participant workbook and quick-reference job aids'
            ],
            completedDeliverables: [
              'Interactive slide curriculum with engaging infographics and discussion prompts'
            ],
            linkedSkillIds: ['skill-train-hands-on-sandboxes', 'skill-train-multimedia-courseware']
          }
        ]
      },
      {
        id: 'stage-train-3',
        stageIndex: 3,
        title: 'Phase 3: High-Impact Workshop Facilitation & Executive Coaching',
        timeframe: 'Months 7 - 9',
        objective: 'Lead virtual and in-person corporate training sessions with dynamic audience engagement, breakout activities, and live demos.',
        milestones: [
          {
            id: 'ms-train-3',
            stageId: 'stage-train-3',
            title: 'Deliver 5-Day Intensive Upskilling Workshop to 100+ Cohort',
            description: 'Facilitate live corporate upskilling program with breakout challenges, guest speakers, and live Q&A moderating.',
            status: 'not_started',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 8',
            deliverables: [
              'High-energy live workshop delivery maintaining >90% daily attendance',
              'Breakout group problem-solving exercises and peer review debriefs',
              'Session recording chapters and searchable timestamped index'
            ],
            linkedSkillIds: ['skill-train-facilitation-presence', 'skill-train-public-speaking']
          }
        ]
      },
      {
        id: 'stage-train-4',
        stageIndex: 4,
        title: 'Phase 4: Kirkpatrick Evaluation & Enterprise Upskilling ROI',
        timeframe: 'Months 10 - 12',
        objective: 'Analyze training outcomes using Kirkpatrick Levels 1 (Reaction), 2 (Learning), 3 (Behavior), and 4 (Business Results/ROI).',
        milestones: [
          {
            id: 'ms-train-4',
            stageId: 'stage-train-4',
            title: 'Publish 90-Day Kirkpatrick Impact & Business ROI Report',
            description: 'Track job performance improvements, reduced error rates, and employee promotion rates following training completion.',
            status: 'not_started',
            difficulty: 'Pinnacle',
            targetTimeframe: 'Month 12',
            deliverables: [
              'Kirkpatrick Level 1-4 analytics dashboard with 90-day follow-up metrics',
              'Documented 3.5x return on investment (ROI) presented to senior leadership',
              'Continuous learning recommendation plan with refresher micro-modules'
            ],
            linkedSkillIds: ['skill-train-kirkpatrick-roi', 'skill-train-needs-analysis']
          }
        ]
      }
    ],
    skills: [
      {
        id: 'skill-train-andragogy-addie',
        name: 'Adult Learning Theory & ADDIE Framework',
        category: 'Learning Science',
        currentLevel: 3,
        targetLevel: 5,
        verifiedLevel: 3,
        description: 'Malcolm Knowles adult learning principles, ADDIE instructional lifecycle (Analyze, Design, Develop, Implement, Evaluate), and agile learning design.',
        prerequisites: ['skill-train-public-speaking'],
        keyTopics: ['Knowles Andragogy Assumptions', 'ADDIE Instructional Model', 'Microlearning Design', 'Scenario-Based Learning', 'Scaffolding Adult Learners']
      },
      {
        id: 'skill-train-kirkpatrick-roi',
        name: 'Training ROI & Kirkpatrick Impact Metrics',
        category: 'Business Analytics',
        currentLevel: 2,
        targetLevel: 5,
        verifiedLevel: 2,
        description: 'Measuring learning impact via Kirkpatrick 4 levels: Reaction, Knowledge Gain, On-the-job Behavior Change, and Business ROI.',
        prerequisites: ['skill-train-needs-analysis'],
        keyTopics: ['Kirkpatrick Levels 1-4', 'Phillips ROI Methodology', 'Pre/Post Competency Assessments', 'Post-Training Behavior Audits', 'Business KPI Attribution']
      },
      {
        id: 'skill-train-hands-on-sandboxes',
        name: 'Interactive Labs & Technical Sandboxes',
        category: 'Lab Engineering',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Creating cloud labs, interactive coding environments (Jupyter/GitHub Codespaces), and step-by-step technical exercise guides.',
        prerequisites: ['skill-train-multimedia-courseware'],
        keyTopics: ['Cloud Sandbox Environments', 'Automated Lab Verification Scripts', 'Job Aids & Cheatsheets', 'Troubleshooting Live Errors']
      },
      {
        id: 'skill-train-facilitation-presence',
        name: 'High-Impact Workshop Facilitation',
        category: 'Facilitation & Coaching',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Engaging large cohorts, managing room dynamics, handling skeptical participants, breakout room orchestration, and live polling.',
        prerequisites: ['skill-train-public-speaking'],
        keyTopics: ['Interactive Room Facilitation', 'Virtual Cohort Engagement Tactics', 'Breakout Session Design', 'Handling Challenging Participants']
      },
      {
        id: 'skill-train-needs-analysis',
        name: 'Training Needs Analysis & Competency Mapping',
        category: 'Consulting & Strategy',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Conducting stakeholder interviews, surveys, identifying operational bottlenecks, and mapping target proficiency models.',
        prerequisites: [],
        keyTopics: ['Stakeholder Interviewing', 'Gap Analysis Surveys', 'Role Competency Frameworks', 'Prioritization Matrices']
      },
      {
        id: 'skill-train-multimedia-courseware',
        name: 'Digital Courseware & Instructional Media Authoring',
        category: 'Content Creation',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Developing high-retention visual slide decks, e-learning modules (Articulate/Rise), video walkthroughs, and visual infographics.',
        prerequisites: [],
        keyTopics: ['Visual Slide Design & Typography', 'E-Learning Authoring (Articulate 360)', 'Screencast Production & Editing', 'Workbook Layouts']
      },
      {
        id: 'skill-train-lms-administration',
        name: 'Enterprise LMS & Learning Experience Platforms (LXP)',
        category: 'Systems Management',
        currentLevel: 3,
        targetLevel: 3,
        verifiedLevel: 3,
        description: 'Deploying and tracking content via SCORM/xAPI, managing learner completions, assignment tracking, and automated certifications.',
        prerequisites: [],
        keyTopics: ['SCORM & xAPI Packages', 'LMS Reporting & Completion Triggers', 'Automated Badge & Certificate Delivery', 'Learner Pathway Routing']
      },
      {
        id: 'skill-train-public-speaking',
        name: 'Executive Presentation Skills & Audience Psychology',
        category: 'Communication',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Vocal modulation, body language, storytelling hooks, dynamic pacing, and commanding executive boardroom attention.',
        prerequisites: [],
        keyTopics: ['Storytelling in Business', 'Vocal Variety & Projection', 'Answering Tough Questions Gracefully', 'Executive Stage Presence']
      }
    ],
    certifications: [
      {
        id: 'cert-train-1',
        title: 'Certified Professional in Learning and Performance (CPLP/CPTD)',
        issuer: 'Association for Talent Development (ATD)',
        issueDate: '2025-07-22',
        credentialId: 'ATD-CPTD-1904',
        fileName: 'atd_cptd_certification.pdf',
        fileSize: '310 KB',
        mimeType: 'application/pdf',
        linkedSkillIds: ['skill-train-andragogy-addie', 'skill-train-kirkpatrick-roi'],
        verified: true,
        uploadedAt: '2026-01-18'
      }
    ],
    recommendedCertifications: [
      {
        id: 'rec-train-1',
        name: 'Kirkpatrick Four Levels Evaluation Bronze Certification',
        issuer: 'Kirkpatrick Partners',
        estimatedCost: '$995',
        relevance: 'Official certification in creating and analyzing world-standard training evaluation programs.',
        linkedSkillIds: ['skill-train-kirkpatrick-roi']
      }
    ],
    createdAt: '2026-01-09',
    lastUpdated: '2026-03-13'
  },

  // 7. Autonomous Deep-Sea Robotics Lead
  {
    id: 'deep-sea-robotics-lead',
    title: 'Autonomous Deep-Sea Robotics Lead',
    slug: 'autonomous-deep-sea-robotics-lead',
    industry: 'Ocean Engineering & Frontier Robotics',
    summary: 'Directs the engineering of extreme-depth autonomous underwater vehicles (AUVs) operating at abyssal depths (6,000m+). Oversees acoustic SLAM, titanium pressure housings, subsea manipulator controls, and long-endurance oceanographic exploration systems.',
    targetHorizon: '12 Months',
    salaryRange: '$175,000 - $260,000 / yr',
    marketDemand: 'Frontier High-Growth (+38% YoY)',
    requiredDegreeOrEquivalent: 'M.S. / Ph.D. or equivalent in Ocean Engineering, Mechatronics, or Robotics',
    keyResponsibilities: [
      'Architect robust acoustic SLAM and doppler navigation pipelines in GPS-denied benthic environments',
      'Oversee hydrostatic stress simulations for titanium and ceramic instrument housings rated to 600 bar',
      'Lead offshore field expedition trials and autonomous vehicle recovery in deep ocean sea states',
      'Engineer fault-tolerant deterministic control firmware for brushless DC thrusters and subsea actuators'
    ],
    stages: [
      {
        id: 'stage-ds-1',
        stageIndex: 1,
        title: 'Phase 1: Marine Hydrodynamics & Embedded Mechatronics',
        timeframe: 'Months 1 - 3',
        objective: 'Master hydrodynamic drag analysis, brushless thruster control loops, pressure vessel sealing, and marine embedded platforms.',
        milestones: [
          {
            id: 'ms-ds-1',
            stageId: 'stage-ds-1',
            title: 'Design and pressure-test a 30-bar O-ring sealed housing',
            description: 'Fabricate an aluminum 6061 pressure vessel with dual radial O-rings; validate in hydrostatic hyperbaric test chamber with zero moisture breach.',
            status: 'achieved',
            difficulty: 'Foundational',
            targetTimeframe: 'Month 2',
            deliverables: [
              'CAD solid model and FEA stress analysis under 3 MPa pressure',
              'CNC machining drawing and tolerance stack-up documentation',
              'Chamber pressure log with 24-hour sensor monitoring'
            ],
            completedDeliverables: [
              'CAD solid model and FEA stress analysis under 3 MPa pressure',
              'CNC machining drawing and tolerance stack-up documentation',
              'Chamber pressure log with 24-hour sensor monitoring'
            ],
            linkedSkillIds: ['skill-pressure-vessels', 'skill-mechatronics'],
            completedAt: '2025-11-14'
          }
        ]
      },
      {
        id: 'stage-ds-2',
        stageIndex: 2,
        title: 'Phase 2: Acoustic Navigation & Subsea Perception',
        timeframe: 'Months 4 - 6',
        objective: 'Implement acoustic localization (USBL/DVL fusion), synthetic aperture sonar processing, and vision in turbid waters.',
        milestones: [
          {
            id: 'ms-ds-4',
            stageId: 'stage-ds-2',
            title: 'Fuse Doppler Velocity Log (DVL) and IMU via Extended Kalman Filter',
            description: 'Develop an EKF pipeline in Rust / C++ fusing 300kHz DVL acoustic beam measurements with tactical-grade MEMS IMU for drift-free dead reckoning.',
            status: 'in_progress',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 5',
            deliverables: [
              'ROS2 navigation node subscribing to DVL raw beam data',
              'Bag file validation demonstrating <0.1% distance traveled drift error'
            ],
            completedDeliverables: [],
            linkedSkillIds: ['skill-acoustic-slam', 'skill-sensor-fusion']
          }
        ]
      },
      {
        id: 'stage-ds-3',
        stageIndex: 3,
        title: 'Phase 3: Fault-Tolerant Autonomous Systems & Subsea ROS2',
        timeframe: 'Months 7 - 9',
        objective: 'Construct hierarchical mission planners, fail-safe emergency surfacing heuristics, and acoustic modem command channels.',
        milestones: [
          {
            id: 'ms-ds-6',
            stageId: 'stage-ds-3',
            title: 'Architect BehaviorTree.CPP autonomous mission executive',
            description: 'Build mission state machine handling dynamic obstacle rerouting, low-battery abort protocols, and tether-free survey execution.',
            status: 'not_started',
            difficulty: 'Advanced',
            targetTimeframe: 'Month 8',
            deliverables: [
              'XML mission tree schema supporting dynamic mission replanning',
              'Hardware-in-the-loop (HIL) gazebo simulator testing 100+ abort scenarios'
            ],
            linkedSkillIds: ['skill-subsea-ros', 'skill-mission-autonomy']
          }
        ]
      },
      {
        id: 'stage-ds-4',
        stageIndex: 4,
        title: 'Phase 4: Benthic Manipulators & Expedition Leadership',
        timeframe: 'Months 10 - 12',
        objective: 'Engineer oil-compensated 7-DOF subsea robotic arms, biological specimen suction samplers, and direct deep-sea trials.',
        milestones: [
          {
            id: 'ms-ds-8',
            stageId: 'stage-ds-4',
            title: 'Direct offshore sea-trials and benthic biological sampling',
            description: 'Lead shipboard AUV deployment from stern A-frame; complete autonomous transect and delicate specimen capture.',
            status: 'not_started',
            difficulty: 'Pinnacle',
            targetTimeframe: 'Month 12',
            deliverables: [
              'Full offshore deployment and recovery operational risk assessment',
              'Autonomous bathymetric survey dataset covering 10 km² at 5cm resolution'
            ],
            linkedSkillIds: ['skill-manipulator-kinematics', 'skill-offshore-leadership']
          }
        ]
      }
    ],
    skills: [
      {
        id: 'skill-offshore-leadership',
        name: 'Offshore Expedition Command',
        category: 'Field Operations',
        currentLevel: 1,
        targetLevel: 5,
        verifiedLevel: 1,
        description: 'Directing research vessel deployments, dynamic positioning coordination, and offshore crisis mitigation.',
        prerequisites: ['skill-mission-autonomy', 'skill-pressure-vessels'],
        keyTopics: ['Vessel A-Frame Operations', 'Dynamic Positioning (DP-2)', 'Emergency Scuttle Protocol']
      },
      {
        id: 'skill-manipulator-kinematics',
        name: 'Pressure-Compensated Manipulator Control',
        category: 'Robotics Controls',
        currentLevel: 1,
        targetLevel: 5,
        verifiedLevel: 1,
        description: 'Impedance control and inverse kinematics for 7-DOF oil-filled subsea arms under extreme hydrostatic pressure.',
        prerequisites: ['skill-subsea-ros', 'skill-mechatronics'],
        keyTopics: ['Impedance Control', 'Oil-Compensated Actuators', 'Visual Servoing']
      },
      {
        id: 'skill-acoustic-slam',
        name: 'Benthic Acoustic SLAM & USBL Navigation',
        category: 'Localization & Mapping',
        currentLevel: 2,
        targetLevel: 5,
        verifiedLevel: 2,
        description: 'Sparse factor-graph acoustic localization fusing DVL, USBL transponders, and synthetic aperture sonar.',
        prerequisites: ['skill-sensor-fusion', 'skill-subsea-ros'],
        keyTopics: ['GTSAM Factor Graphs', 'Acoustic Multipath Rejection', 'DVL Odometry']
      },
      {
        id: 'skill-pressure-vessels',
        name: 'Hyperbaric Mechanical Enclosures (600 Bar)',
        category: 'Mechanical Engineering',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Designing thick-wall Grade 5 Titanium and alumina ceramic pressure vessels with dual elastomer seals.',
        prerequisites: ['skill-hydrodynamics'],
        keyTopics: ['ASME PVHO-1 Standard', 'Titanium Ti-6Al-4V FEA', 'Hermetic Penetrators']
      },
      {
        id: 'skill-mission-autonomy',
        name: 'Fault-Tolerant Deliberative Autonomy',
        category: 'Software Engineering',
        currentLevel: 2,
        targetLevel: 4,
        verifiedLevel: 2,
        description: 'Behavior trees, contingency fail-safes, and energy-optimal oceanographic path planners.',
        prerequisites: ['skill-subsea-ros'],
        keyTopics: ['BehaviorTree.CPP', 'A* Ocean Current Routing', 'Watchdog Circuitry']
      },
      {
        id: 'skill-subsea-ros',
        name: 'Real-Time ROS2 & DDS Marine Middleware',
        category: 'Software Engineering',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Deterministic ROS2 Iron pipelines with Zero-Copy CycloneDDS for mission-critical subsea sensor busses.',
        prerequisites: ['skill-mechatronics'],
        keyTopics: ['ROS2 Lifecycle Nodes', 'CycloneDDS Zero-Copy', 'CANopen Marine Stacks']
      },
      {
        id: 'skill-sensor-fusion',
        name: 'Kalman Filtering & Stochastic Estimation',
        category: 'Algorithm Design',
        currentLevel: 3,
        targetLevel: 4,
        verifiedLevel: 3,
        description: 'Error-State Extended Kalman Filtering (ES-EKF) for underwater dead-reckoning.',
        prerequisites: ['skill-mechatronics'],
        keyTopics: ['ES-EKF', 'Lie Groups SO(3)', 'Outlier Rejection']
      },
      {
        id: 'skill-mechatronics',
        name: 'Subsea Power & Motor Drive Firmware',
        category: 'Hardware Engineering',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Field-oriented control (FOC) for oil-filled brushless DC motors, battery BMS, and galvanically isolated busses.',
        prerequisites: [],
        keyTopics: ['STM32 Embedded C++', 'FOC Motor Control', 'Galvanic Isolation']
      },
      {
        id: 'skill-hydrodynamics',
        name: 'Computational Fluid Dynamics & Tow Tanks',
        category: 'Physics & Simulation',
        currentLevel: 4,
        targetLevel: 4,
        verifiedLevel: 4,
        description: 'Reynolds-averaged Navier-Stokes (RANS) flow simulations in OpenFOAM and drag minimization.',
        prerequisites: [],
        keyTopics: ['OpenFOAM Meshing', 'Added Mass Matrices', 'Tow Tank Experimentation']
      }
    ],
    certifications: [
      {
        id: 'cert-ds-1',
        title: 'Offshore Survival & Safety at Sea (BOSIET)',
        issuer: 'OPITO International',
        issueDate: '2025-09-10',
        credentialId: 'BOSIET-99214-UK',
        fileName: 'bosiet_certification.pdf',
        fileSize: '380 KB',
        mimeType: 'application/pdf',
        linkedSkillIds: ['skill-offshore-leadership'],
        verified: true,
        uploadedAt: '2026-01-08'
      }
    ],
    recommendedCertifications: [
      {
        id: 'rec-ds-1',
        name: 'Certified Ocean Engineer (COE)',
        issuer: 'Marine Technology Society (MTS)',
        estimatedCost: '$650',
        relevance: 'Validates senior technical capability across hydrodynamics, subsea acoustics, and vehicle architectures.',
        linkedSkillIds: ['skill-pressure-vessels', 'skill-acoustic-slam']
      }
    ],
    createdAt: '2025-10-01',
    lastUpdated: '2026-02-15'
  }
];

import { JobRoadmap, SkillGapStatus, MonthPlan } from '../types/roadmap';

function enrichPreset(p: any): JobRoadmap {
  const currentSkills = ['Python', 'Linear Algebra', 'Git', 'Linux Systems', 'Problem Solving'];
  const timelineMonths = p.targetTimelineMonths || 12;
  const weeklyHours = p.weeklyStudyHours || 15;

  const enrichedSkills = p.skills.map((s: any, idx: number) => {
    const isBase = s.prerequisites.length === 0;
    const isTarget = idx <= 1 || s.targetLevel === 5;
    const tierLevel = isBase ? 3 : isTarget ? 1 : 2;

    const isPossessed = idx === 0 || s.name.toLowerCase().includes('python') || s.name.toLowerCase().includes('algebra') || s.name.toLowerCase().includes('foundations');
    const isPartial = !isPossessed && (idx === 1 || idx === 2);
    const gapStatus: SkillGapStatus = isPossessed ? 'possessed' : isPartial ? 'partial' : 'missing';
    const hours = isPossessed ? 0 : isPartial ? 30 : 65;

    return {
      ...s,
      tierLevel,
      gapStatus,
      matchReason: isPossessed
        ? 'Matches your background profile.'
        : isPartial
        ? 'Foundational basis exists; needs domain application.'
        : 'Required core capability to achieve.',
      estimatedHoursToBridge: hours
    };
  });

  let possessedCount = 0;
  let partialCount = 0;
  let missingCount = 0;
  let totalBridgeHours = 0;

  enrichedSkills.forEach((s: any) => {
    if (s.gapStatus === 'possessed') possessedCount++;
    else if (s.gapStatus === 'partial') partialCount++;
    else missingCount++;
    totalBridgeHours += s.estimatedHoursToBridge;
  });

  const totalSkillsCount = enrichedSkills.length;
  const readinessQuotient = Math.round(((possessedCount * 1.0 + partialCount * 0.5) / totalSkillsCount) * 100);

  const monthPlans: MonthPlan[] = [
    {
      id: 'month-1',
      monthNumber: 1,
      title: 'Month 1: Theoretical Foundations & First Principles',
      theme: 'Foundations & Mathematical Tooling',
      weeklyHoursTarget: weeklyHours,
      focusSkillIds: [enrichedSkills[enrichedSkills.length - 1]?.id || 'sk-1'],
      completed: true,
      milestones: p.stages[0]?.milestones.slice(0, 1) || [],
      resources: [
        {
          id: 'res-p-1',
          title: `MIT OpenCourseWare: Principles of ${p.title}`,
          type: 'Course' as const,
          provider: 'MIT OpenCourseWare',
          estimatedHours: 25,
          completed: true,
          linkedSkillId: enrichedSkills[enrichedSkills.length - 1]?.id
        },
        {
          id: 'res-p-2',
          title: 'Foundational Systems & Numerical Methods',
          type: 'Book' as const,
          provider: 'O\'Reilly / Academic Press',
          estimatedHours: 20,
          completed: true,
          linkedSkillId: enrichedSkills[enrichedSkills.length - 1]?.id
        }
      ]
    },
    {
      id: 'month-2',
      monthNumber: 2,
      title: 'Month 2: Core Tooling & Practice Environment',
      theme: 'Hands-on Frameworks & System Integration',
      weeklyHoursTarget: weeklyHours,
      focusSkillIds: [enrichedSkills[enrichedSkills.length - 2]?.id || 'sk-2'],
      completed: true,
      milestones: p.stages[0]?.milestones.slice(1, 2) || [],
      resources: [
        {
          id: 'res-p-3',
          title: 'Official Framework Architecture & API Guides',
          type: 'Documentation' as const,
          provider: 'Official Documentation',
          estimatedHours: 18,
          completed: false,
          linkedSkillId: enrichedSkills[enrichedSkills.length - 2]?.id
        }
      ]
    },
    {
      id: 'month-3',
      monthNumber: 3,
      title: 'Month 3: Intermediate Architecture & Deep-Dives',
      theme: 'Applied Pipelines & Rigorous Benchmarks',
      weeklyHoursTarget: weeklyHours,
      focusSkillIds: [enrichedSkills[2]?.id || 'sk-3'],
      completed: false,
      milestones: p.stages[1]?.milestones.slice(0, 1) || [],
      resources: [
        {
          id: 'res-p-4',
          title: 'Production Design Patterns & Best Practices',
          type: 'Course' as const,
          provider: 'Coursera / Industry Consortium',
          estimatedHours: 28,
          completed: false,
          linkedSkillId: enrichedSkills[2]?.id
        }
      ]
    },
    {
      id: 'month-4',
      monthNumber: 4,
      title: 'Month 4: Real-World Implementation & Case Studies',
      theme: 'End-to-End Implementation Project',
      weeklyHoursTarget: weeklyHours,
      focusSkillIds: [enrichedSkills[3]?.id || 'sk-4'],
      completed: false,
      milestones: p.stages[1]?.milestones.slice(1, 2) || [],
      resources: [
        {
          id: 'res-p-5',
          title: 'Case Study Lab: Industry Scale Implementations',
          type: 'Project' as const,
          provider: 'Open Source Community',
          estimatedHours: 35,
          completed: false,
          linkedSkillId: enrichedSkills[3]?.id
        }
      ]
    },
    {
      id: 'month-5',
      monthNumber: 5,
      title: 'Month 5: Advanced Optimization & Scaling',
      theme: 'Performance Tuning & Reliability',
      weeklyHoursTarget: weeklyHours,
      focusSkillIds: [enrichedSkills[1]?.id || 'sk-5'],
      completed: false,
      milestones: p.stages[2]?.milestones.slice(0, 1) || [],
      resources: [
        {
          id: 'res-p-6',
          title: 'High-Throughput Performance Tuning & Concurrency',
          type: 'Documentation' as const,
          provider: 'Engineering Standards',
          estimatedHours: 24,
          completed: false,
          linkedSkillId: enrichedSkills[1]?.id
        }
      ]
    },
    {
      id: 'month-6',
      monthNumber: 6,
      title: 'Month 6: Capstone Project & Leadership Portfolio',
      theme: 'Production Capstone & Demonstration',
      weeklyHoursTarget: weeklyHours,
      focusSkillIds: [enrichedSkills[0]?.id || 'sk-6'],
      completed: false,
      milestones: p.stages[3]?.milestones || [],
      resources: [
        {
          id: 'res-p-7',
          title: 'Professional Mastery & Capstone Specification',
          type: 'Certification' as const,
          provider: 'Professional Standards Institute',
          estimatedHours: 40,
          completed: false,
          linkedSkillId: enrichedSkills[0]?.id
        }
      ]
    }
  ];

  return {
    ...p,
    targetTimelineMonths: timelineMonths,
    targetHorizon: `${timelineMonths} Months`,
    weeklyStudyHours: weeklyHours,
    userCurrentSkills: currentSkills,
    skills: enrichedSkills,
    monthPlans,
    gapAnalysisSummary: {
      possessedCount,
      partialCount,
      missingCount,
      totalRequiredSkills: totalSkillsCount,
      estimatedTotalHoursToBridge: totalBridgeHours,
      currentReadinessQuotient: readinessQuotient
    }
  };
}

export const PRESET_ROADMAPS: JobRoadmap[] = RAW_PRESETS.map(enrichPreset);
