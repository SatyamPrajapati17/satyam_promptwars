import { Decision } from "./decisions";

export function generateSampleDecision(userId: string): Decision {
  const decisionId = "sample-" + Math.random().toString(36).substring(2, 9);

  return {
    id: decisionId,
    user_id: userId,
    title: "Migrate Core Monolith to Event-Driven Microservices",
    category: "technical",
    stakes: "critical",
    reversibility: "one_way_door",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split("T")[0],
    status: "audited",
    emotional_state: {
      gut_feeling: "Excited about modern architecture, but worried about operational overhead.",
      stress_level: 7,
      time_pressure: true,
    },
    options: [
      {
        id: "opt-1",
        decision_id: decisionId,
        title: "Event-Driven Microservices on Kubernetes",
        description: "Decompose order, billing, and inventory into isolated services with Kafka and gRPC.",
        pros: [
          "Independent team deployability",
          "Isolated failure blast radius",
          "Granular horizontal auto-scaling",
        ],
        cons: [
          "High distributed systems complexity",
          "Eventual consistency and dual-write risks",
          "Requires dedicated platform/DevOps engineering",
        ],
        estimated_cost: "$120,000 / yr + 4 months refactor",
      },
      {
        id: "opt-2",
        decision_id: decisionId,
        title: "Modular Monolith with Domain-Driven Boundaries",
        description: "Enforce strict interface contracts and isolated schemas inside the existing runtime.",
        pros: [
          "Single deployable artifact and atomic transactions",
          "Low cognitive load and no network latency between domains",
          "Faster time-to-market for immediate quarters",
        ],
        cons: [
          "Shared process memory can still lead to global crashes",
          "Longer build and CI pipeline test runs as code grows",
        ],
        estimated_cost: "$35,000 / yr + 6 weeks refactor",
      },
    ],
    reasons: [
      {
        id: "rs-1",
        decision_id: decisionId,
        statement: "Our developer team will double in size within the next 9 months.",
        confidence: 60,
        evidence_level: "moderate",
        is_assumption: true,
      },
      {
        id: "rs-2",
        decision_id: decisionId,
        statement: "Kafka will eliminate database connection pooling bottlenecks during Black Friday.",
        confidence: 85,
        evidence_level: "rigorous",
        is_assumption: false,
      },
      {
        id: "rs-3",
        decision_id: decisionId,
        statement: "The current team has enough Kubernetes expertise to manage production clusters.",
        confidence: 40,
        evidence_level: "anecdotal",
        is_assumption: true,
      },
    ],
    blind_spots: [
      {
        id: "bs-1",
        decision_id: decisionId,
        bias_type: "Overconfidence Bias",
        title: "Underestimating Distributed Failure Modes",
        description:
          "Team confidence in Kubernetes operations is based on local minikube experience rather than handling live split-brain Kafka partitions.",
        severity: "critical",
        remedy_question:
          "What specific incident runbooks exist for cascading consumer lag under peak write traffic?",
        suggested_action: "Run chaos testing rehearsal on staging before making architectural cutover.",
        status: "open",
      },
      {
        id: "bs-2",
        decision_id: decisionId,
        bias_type: "Shiny Object Syndrome",
        title: "Architecture Driven by Resume Building",
        description:
          "The push for microservices may be motivated by industry trends rather than quantitative latency or throughput constraints.",
        severity: "warning",
        remedy_question:
          "Can our current peak queries/sec be resolved with database read-replicas and caching?",
        suggested_action: "Benchmark existing monolith query latency under 5x simulated peak load.",
        status: "open",
      },
      {
        id: "bs-3",
        decision_id: decisionId,
        bias_type: "Planning Fallacy",
        title: "Migration Timeline Optimism",
        description:
          "A 4-month dual-write migration frequently stretches to 10+ months due to historical data reconciliation.",
        severity: "advisory",
        remedy_question:
          "What is the fallback milestone if phase 1 data synchronization takes 8 weeks instead of 2?",
        suggested_action: "Establish a hard stop-and-revert condition based on weekly sprint burn-down.",
        status: "addressed",
        notes: "Defined 6-week checkpoint: If data reconciliation error rate > 0.01%, pause cutover.",
      },
    ],
    premortem_items: [
      {
        id: "pm-1",
        decision_id: decisionId,
        scenario: "Eventual consistency causes duplicate payment charges during network timeout.",
        likelihood: "medium",
        impact: "high",
        early_indicator: "Dead-letter queue message count growing faster than 5 msg/sec.",
        preventative_measure: "Mandate idempotency keys on all webhook receivers and billing handlers.",
        status: "open",
      },
      {
        id: "pm-2",
        decision_id: decisionId,
        scenario: "DevOps lead resigns during migration, stalling all containerized deployments.",
        likelihood: "low",
        impact: "high",
        early_indicator: "PR review turnaround time exceeds 72 hours for deployment manifests.",
        preventative_measure: "Cross-train two senior backend engineers in Terraform and cluster ops.",
        status: "open",
      },
    ],
    actions: [
      {
        id: "act-1",
        decision_id: decisionId,
        title: "Simulate 5x write load on existing Postgres database",
        description: "Determine exact breaking point of current connection pool.",
        status: "todo",
        priority: "high",
        due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0],
        source_type: "blind_spot",
        source_id: "bs-2",
      },
      {
        id: "act-2",
        decision_id: decisionId,
        title: "Implement idempotency key specification for billing RPCs",
        description: "Prevent duplicate charges during message retry loops.",
        status: "in_progress",
        priority: "high",
        due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString().split("T")[0],
        source_type: "premortem",
        source_id: "pm-1",
      },
      {
        id: "act-3",
        decision_id: decisionId,
        title: "Interview 3 engineering teams who migrated to microservices",
        description: "Collect actual cost overrun and operational friction metrics.",
        status: "done",
        priority: "medium",
        due_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString().split("T")[0],
        source_type: "manual",
      },
    ],
    readiness_score: 68,
    ai_summary:
      "This decision carries high architectural irreversibility. While the microservices route provides clear scaling boundaries, the team's operational readiness is currently unverified. Addressing the 2 critical blind spots and verifying database limits will raise audit readiness above 85%.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    is_sample: true,
  };
}
