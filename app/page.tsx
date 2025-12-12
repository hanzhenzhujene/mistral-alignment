'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  Scale, 
  ShieldAlert, 
  Gavel, 
  Server, 
  Network, 
  Layers, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronDown, 
  ExternalLink,
  AlertTriangle,
  Lock,
  Activity,
  FileText
} from 'lucide-react';

const SECTIONS = [
  { id: 'intro', title: 'I. Introduction' },
  { id: 'alignment', title: 'II. Defining Alignment' },
  { id: 'background', title: 'III. Background Knowledge' },
  { id: 'regulatory', title: 'IV. Regulatory Anchors' },
  { id: 'structure', title: 'V. Structural Differences' },
  { id: 'pipeline', title: 'VI. Pipeline Control' },
  { id: 'features', title: 'VII. Feature Analysis' },
  { id: 'future', title: 'IX. Future Directions' },
  { id: 'references', title: 'X. References' },
];

const CITATIONS = {
  1: { text: "Clinical Decision Support Software - Guidance", url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software" },
  2: { text: "FDA Clinical Decision Support Software - Final Guidance", url: "https://www.fda.gov/media/162880/download" },
  3: { text: "NIST AI Risk Management Framework 1.0", url: "https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf" },
  4: { text: "JAMA Network Open: Large Language Model Influence on Diagnostic Reasoning", url: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825395" },
  5: { text: "Nature: Multi-model assurance analysis showing large language...", url: "https://www.nature.com/articles/s43856-025-01021-3" },
  6: { text: "Nature Medicine: Medical Large Language Models vulnerable to data poisoning", url: "https://www.nature.com/articles/s41591-024-03445-1" },
  7: { text: "FDA PCCP Guidance for AI-enabled devices", url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/marketing-submission-recommendations-predetermined-change-control-plan-artificial-intelligence" },
  8: { text: "EU AI Act | Shaping Europe's digital future", url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" },
  9: { text: "MDCG 2019-11 rev.1 - Medical Device Software", url: "https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en" },
  10: { text: "WHO Ethics and governance of AI for health", url: "https://www.who.int/publications/i/item/9789240029200" },
  11: { text: "Mistral Finetune GitHub", url: "https://github.com/mistralai/mistral-finetune" },
  12: { text: "ArXiv: Mixtral of Experts", url: "https://arxiv.org/abs/2401.04088" },
  13: { text: "Mistral Docs: vLLM Self-Deployment", url: "https://docs.mistral.ai/deployment/self-deployment/vllm" },
  14: { text: "Mistral Inference GitHub", url: "https://github.com/mistralai/mistral-inference" },
  15: { text: "ArXiv: Mixtral of experts (Audit Tools)", url: "https://arxiv.org/pdf/2401.04088" },
  16: { text: "Mistral AI - Apache 2.0 License Announcement", url: "https://mistral.ai/news/mixtral-of-experts" },
  17: { text: "Anthropic Terms of Service (Commercial usage via API)", url: "https://www-cdn.anthropic.com/6b68a6508f0210c5fe08f0199caa05c4ee6fb4dc/Anthropic-on-Bedrock-Commercial-Terms-of-Service_Dec_2023.pdf" },
  18: { text: "Claude 3 Model Card", url: "https://www.anthropic.com/news/claude-3-family" },
  19: { text: "vLLM Documentation (Supported Models: Mixtral)", url: "https://docs.vllm.ai/en/latest/models/supported_models/" },
  20: { text: "Ollama Library (Mistral Quantized Variants)", url: "https://ollama.com/library/mistral" },
  21: { text: "Anthropic Security Whitepaper", url: "https://assets.anthropic.com/m/c52125297b85a42/original/Confidential_Inference_Paper.pdf" }
};

// Reusable Components
const SectionHeader = ({ number, title, icon: Icon }) => (
  <div className="flex items-center gap-3 mb-6 border-b border-stone-200 pb-3 mt-16 first:mt-0">
    {Icon && <Icon className="w-6 h-6 text-stone-500" />}
    <h2 className="text-2xl font-serif text-stone-800 font-medium tracking-tight">
      <span className="text-stone-400 mr-2 font-sans text-lg font-normal">{number}</span>
      {title}
    </h2>
  </div>
);

const Citation = ({ id }) => {
  const info = CITATIONS[id];
  return (
    <a 
      href={info?.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center align-super text-[10px] font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 hover:text-stone-800 rounded px-1 ml-0.5 transition-colors no-underline"
      title={info?.text}
    >
      {id}
    </a>
  );
};

const Card = ({ title, children, className = "" }) => (
  <div className={`bg-white border border-stone-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
    {title && <h3 className="font-serif text-lg font-medium text-stone-800 mb-3">{title}</h3>}
    <div className="text-stone-600 leading-relaxed text-sm">
      {children}
    </div>
  </div>
);

const HighlightBox = ({ title, children, type = "neutral" }) => {
  const styles = {
    neutral: "bg-stone-50 border-stone-200 text-stone-700",
    accent: "bg-[#F4F1EA] border-[#D6CEC0] text-stone-800", // Warm beige
    alert: "bg-amber-50 border-amber-200 text-amber-900",
  };
   
  return (
    <div className={`p-5 rounded-lg border ${styles[type]} my-4`}>
      {title && <h4 className="font-bold text-sm uppercase tracking-wider mb-2 opacity-80">{title}</h4>}
      <div className="leading-relaxed">
        {children}
      </div>
    </div>
  );
};

const ComparisonTable = ({ headers, rows }) => (
  <div className="overflow-x-auto border border-stone-200 rounded-lg mb-4">
    <table className="w-full text-sm text-left min-w-[600px]">
      <thead className="bg-stone-100 text-stone-800 font-serif font-bold">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-3 border-b border-stone-200 whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-stone-100">
        {rows.map((row, i) => (
          <tr key={i} className="bg-white hover:bg-stone-50/50">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 align-top text-stone-600">
                {j === 0 ? <span className="font-bold text-stone-800">{cell}</span> : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TaxonomyGrid = () => {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[600px] grid grid-cols-6 gap-2 text-xs">
        <div className="col-span-1"></div>
        {['Information Retrieval', 'Diagnostic Support', 'Treatment Planning', 'Documentation', 'Patient Communication'].map(h => (
          <div key={h} className="font-bold text-stone-400 text-center pb-2 px-1 leading-tight">{h}</div>
        ))}
        
        {['In-hospital', 'Telehealth', 'Medical Education', 'Rehab & Recovery', 'Public Health'].map((row, i) => (
          <React.Fragment key={row}>
            <div className="font-bold text-stone-500 py-3 pr-2 text-right">{row}</div>
            {Array(5).fill(0).map((_, j) => {
              const isTarget = i === 0 && j === 1;
              return (
                <div 
                  key={`${i}-${j}`} 
                  className={`
                    border rounded flex items-center justify-center p-2 text-center transition-all
                    ${isTarget 
                      ? 'bg-stone-800 text-white border-stone-800 shadow-md transform scale-105 z-10 font-medium' 
                      : 'bg-white border-stone-100 text-stone-300'}
                  `}
                >
                  {isTarget ? "OUR SCOPE" : "•"}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center text-xs text-stone-400 mt-2 italic">Fig 1. Identifying the High-Stakes Cell</div>
    </div>
  );
};

const RiceDimension = ({ title, question, core, shell, choice }) => (
  <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="bg-stone-50 border-b border-stone-100 p-4">
      <h3 className="font-serif text-lg font-bold text-stone-900">{title}</h3>
      <p className="text-sm text-stone-600 italic mt-1">{question}</p>
    </div>
    <div className="p-0">
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
        <div className="p-5">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Technical / Ability Core</div>
          <div className="space-y-3 text-sm text-stone-700">
            {core}
          </div>
        </div>
        <div className="p-5 bg-stone-50/30">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Normative / Choice Shell</div>
          <div className="space-y-3 text-sm text-stone-700">
            {shell}
          </div>
        </div>
      </div>
      <div className="bg-stone-800 p-4 text-stone-50 text-sm">
        <span className="font-bold text-stone-300 uppercase text-xs tracking-wider mr-2">The Choice:</span>
        {choice}
      </div>
    </div>
  </div>
);

const FeatureTabs = () => {
  const [activeTab, setActiveTab] = useState('A');

  const content = {
    A: {
      title: "Open Weights",
      subtitle: "Deep Dive: Open Weights and Alignment Transfer",
      icon: Layers,
      content: (
        <div className="space-y-6">
          <p className="text-stone-600">
            The open weights property of Mistral's models means the complete set of parameters is accessible to the deploying institution (the hospital). This shifts the site of alignment control: safety is no longer solely guaranteed by the centralized model provider, but becomes the direct responsibility and burden of the hospital's engineering and governance teams.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Card title="Anatomy of Safety Layers and Modification Paths">
              <p className="mb-2 text-sm text-stone-500">What “safety layers” means here</p>
              <ul className="list-disc pl-4 space-y-2 text-sm text-stone-600">
                <li><strong>Alignment Fine-Tuning:</strong> Instruction-tuning, preference tuning (Direct Preference Optimization, Proximal Policy Optimization).</li>
                <li><strong>System Prompts:</strong> Policy wrappers and guardrail templates set by the deployer.</li>
                <li><strong>Filtering Layers:</strong> Guardrail classifiers and filtering layers (e.g., Protected Health Information redaction).</li>
                <li><strong>Deployment Constraints:</strong> Tool permissions, retrieval scope, logging, and access control.</li>
              </ul>
            </Card>
            <Card title="Modification Risks">
              <p className="mb-2 text-sm text-stone-500">What “modification” means</p>
              <div className="space-y-3">
                <div>
                  <strong className="block text-stone-800 text-sm">1. Fine-tuning</strong>
                  <span className="text-sm text-stone-600">Standard updates leading to desired feature enhancement, but carrying the risk of benign or risky alignment drift.</span>
                </div>
                <div>
                  <strong className="block text-stone-800 text-sm">2. Deliberate Safety Removal or Bypass</strong>
                  <span className="text-sm text-stone-600">Malicious or negligent changes that could bypass safety filters, creating an upstream risk for the clinical workflow.</span>
                </div>
              </div>
            </Card>
          </div>

          <HighlightBox title="Evaluation Checklist" type="accent">
            <ul className="list-none space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-stone-600 mt-1 shrink-0"/> 
                <span><strong>Fine-tuning Sensitivity:</strong> Continuously evaluate safety behavior drift across fine-tuned versions.</span>
              </li>
              <li className="flex items-start gap-2">
                <Gavel className="w-4 h-4 text-stone-600 mt-1 shrink-0"/> 
                <span><strong>Release Discipline:</strong> Implement versioning, evaluation gates, and monitoring inspired by lifecycle control thinking, such as the Predetermined Change Control Plan (PCCP) framework from the U.S. Food and Drug Administration. <Citation id={7} /></span>
              </li>
            </ul>
          </HighlightBox>
        </div>
      )
    },
    B: {
      title: "Local Deployability",
      subtitle: "Deep Dive: Local Deployability and Operational Burden",
      icon: Server,
      content: (
        <div className="space-y-6">
          <p className="text-stone-600">
            Local deployment refers to running Mistral's open-weight models directly on a hospital's on-premise or secure private cloud infrastructure, rather than relying on an external provider's API. While this dramatically reduces Protected Health Information egress risk (a privacy benefit), it fundamentally shifts the entire security and compliance burden from the model vendor to the deploying institution. <Citation id={13} />
          </p>

          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
             <div className="bg-stone-100 px-6 py-3 border-b border-stone-200 font-serif font-medium text-stone-800 flex justify-between">
               <span>Core Trade-Offs</span>
               <span className="text-xs font-sans text-stone-500 font-normal mt-1">Privacy vs Burden</span>
             </div>
             <div className="divide-y divide-stone-100">
                <div className="grid grid-cols-12 bg-stone-50 text-xs font-bold text-stone-500 p-2 uppercase tracking-wider">
                  <div className="col-span-3">Aspect</div>
                  <div className="col-span-4">Benefit (Control & Privacy)</div>
                  <div className="col-span-5">Cost (Burden & Risk Transfer)</div>
                </div>
             {[
               { aspect: 'Data Flow', ben: 'Reduces Protected Health Information egress and supports data-minimization strategies.', cost: 'Hospital assumes responsibility for all data-in-transit and data-at-rest security.' },
               { aspect: 'Software', ben: 'Full control over model version, patching, and dependencies (version pinning).', cost: 'Hospital is responsible for vulnerability patching, system maintenance, and dependency management.' },
               { aspect: 'Oversight', ben: 'Enables granular, internal access governance and audit controls.', cost: 'Hospital assumes responsibility for security posture, monitoring, and incident response.' }
             ].map((row) => (
               <div key={row.aspect} className="p-3 grid grid-cols-12 gap-4 text-sm">
                 <div className="col-span-3 font-bold text-stone-800">{row.aspect}</div>
                 <div className="col-span-4 text-stone-600">{row.ben}</div>
                 <div className="col-span-5 text-amber-800/80 bg-amber-50/50 p-1 rounded">{row.cost}</div>
               </div>
             ))}
             </div>
          </div>

          <Card title="Compliance Nuance: Architecture vs. Governance">
            <p className="mb-3 text-sm italic text-stone-500">Critical: Local deployment only makes compliance possible; it does not guarantee it. Compliance (e.g., Health Insurance Portability and Accountability Act, General Data Protection Regulation, or National Institute of Standards and Technology AI Risk Management Framework adherence) depends entirely on the Choice Shell—the institutional governance and human processes put in place.</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-2">
                <Lock className="w-4 h-4 text-stone-400 mt-1"/>
                <span><strong>Access Control:</strong> Implementing role-based access for clinicians and auditors.</span>
              </div>
              <div className="flex gap-2">
                <FileText className="w-4 h-4 text-stone-400 mt-1"/>
                <span><strong>Auditing:</strong> Generating detailed, immutable audit logs of every prompt, response, and Mixture of Experts routing decision.</span>
              </div>
              <div className="flex gap-2">
                <ShieldAlert className="w-4 h-4 text-stone-400 mt-1"/>
                <span><strong>Policies:</strong> Establishing formal incident response procedures and data retention policies.</span>
              </div>
              <div className="flex gap-2">
                <Brain className="w-4 h-4 text-stone-400 mt-1"/>
                <span><strong>Human Process:</strong> Ensuring human oversight protocols are followed and clinicians are trained. <Citation id={10} /></span>
              </div>
            </div>
          </Card>

          <HighlightBox title="Evaluation Checklist: Operationalizing Accountability" type="neutral">
            <ul className="list-disc pl-4 space-y-2 text-sm text-stone-700">
              <li><strong>Security & Logs:</strong> Access control mechanisms, audit log integrity, and incident procedures.</li>
              <li><strong>Update Governance:</strong> Clear protocols for model updates, version rollbacks, and software patching.</li>
              <li><strong>Operational Culture Test:</strong> This is the most critical element of the Choice Shell. Do protocols and incentives genuinely empower clinicians to override AI recommendations without penalty, and are escalation paths clearly defined? <Citation id={3} /></li>
              <li><strong>Predetermined Change Control Plan Alignment:</strong> Does the local update and monitoring plan align with the lifecycle control framework of a Predetermined Change Control Plan (PCCP)? <Citation id={7} /></li>
            </ul>
          </HighlightBox>
        </div>
      )
    },
    C: {
      title: "MoE Architecture",
      subtitle: "Deep Dive: Mixture of Experts Architecture (Mixtral-Style Routing)",
      icon: Network,
      content: (
        <div className="space-y-6">
          <p className="text-stone-600">
            The Mixtral of Experts (MoE) architecture, a core feature of Mistral's open-weight models, increases capacity and efficiency via sparse and dynamic routing. In a high-stakes clinical setting, this dynamism introduces specific risks related to consistency (Route Variability) and accountability (Traceability) that require new governance tools.
          </p>

          <Card title="Ability Core: Conditional Computation">
             <ul className="list-disc pl-4 space-y-2 text-sm text-stone-600">
               <li><strong>Router:</strong> A trainable gate network determines which expert(s) are best suited for the current input token.</li>
               <li><strong>Expert Selection:</strong> The router selects exactly <strong>two experts</strong> per token per layer to process the input state and combine their outputs. <Citation id={12} /></li>
               <li><strong>Dynamic Routing:</strong> The selected experts can be different for every token and at every layer, meaning the active computational path changes constantly. This allows for high model capacity with low inference cost per token.</li>
             </ul>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                Route Variability Risk
              </h4>
              <p className="text-sm text-amber-900/80">
                Small, clinically irrelevant input changes or rephrasing might trigger different expert routes, leading to disproportionate and inconsistent diagnostic outputs.
              </p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                Traceability Risk
              </h4>
              <p className="text-sm text-amber-900/80">
                The dynamic nature of expert routing makes it harder to communicate the specific 'basis' or path that led to a recommendation, challenging clinician review and accountability.
              </p>
            </div>
          </div>

          <HighlightBox title="Evaluation and Measurement Checklist (Choice Shell)" type="accent">
             <p className="text-sm text-stone-600 mb-2">To mitigate Mixture of Experts-specific risks, the deploying institution must implement advanced auditing:</p>
             <ul className="space-y-2 text-sm text-stone-800">
               <li className="flex gap-2">
                 <Activity className="w-4 h-4 text-stone-500 mt-1"/>
                 <span><strong>Route Stability Tests:</strong> Measure output and routing variance when the input is subjected to small perturbations, assessing consistency.</span>
               </li>
               <li className="flex gap-2">
                 <Scale className="w-4 h-4 text-stone-500 mt-1"/>
                 <span><strong>Basis Review Test:</strong> Determine if clinicians can independently review enough basis information (like evidence links and expert attribution summaries) to meet the U.S. Food and Drug Administration's safety expectations for Clinical Decision Support framing. <Citation id={2} /></span>
               </li>
             </ul>
          </HighlightBox>

          <p className="text-xs text-stone-500 italic">
            <strong>Future Potential:</strong> Mixture of Experts could support modular specialization (e.g., specific experts for service lines like cardiology or oncology), but this remains speculative and requires dedicated governance tooling for validation and auditing to be safely realized.
          </p>
        </div>
      )
    }
  };

  return (
    <div className="bg-stone-50 rounded-xl p-2 border border-stone-200">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {Object.entries(content).map(([key, data]) => {
          const Icon = data.icon;
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${isActive 
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200' 
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'}
              `}
            >
              <Icon className="w-4 h-4" />
              Feature {key}: {data.title}
            </button>
          );
        })}
      </div>
      <div className="bg-white rounded-lg p-6 border border-stone-100 shadow-sm animate-in fade-in duration-300">
        <h3 className="text-xl font-serif text-stone-800 mb-4">{content[activeTab].subtitle || content[activeTab].title}</h3>
        {content[activeTab].content}
      </div>
    </div>
  );
};

export default function MistralProposal() {
  const [activeSection, setActiveSection] = useState('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map(s => document.getElementById(s.id));
      const scrollPos = window.scrollY + 150; // Offset

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#333333] font-sans selection:bg-stone-200">
       
      {/* Navigation - Desktop */}
      <nav className="hidden lg:block fixed left-0 top-0 h-screen w-72 border-r border-stone-200 bg-[#FDFCF8] p-8 overflow-y-auto z-50">
        <div className="mb-10">
          <div className="w-8 h-8 bg-stone-800 rounded-lg mb-4"></div>
          <h1 className="font-serif text-lg font-bold leading-tight text-stone-900">
            Mistral Alignment Analysis
          </h1>
          <p className="text-xs text-stone-500 mt-2 font-medium uppercase tracking-widest">Xin & Jenny</p>
        </div>
        <ul className="space-y-1">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollTo(section.id)}
                className={`
                  text-sm py-2 px-3 rounded-md w-full text-left transition-colors
                  ${activeSection === section.id 
                    ? 'bg-stone-100 text-stone-900 font-medium' 
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'}
                `}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Navigation - Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-[#FDFCF8]/90 backdrop-blur-md border-b border-stone-200 z-50 px-6 py-4 flex justify-between items-center">
        <span className="font-serif font-bold text-stone-900 truncate pr-4">The Double-Edged Scalpel</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6 text-stone-600"/> : <Menu className="w-6 h-6 text-stone-600"/>}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#FDFCF8] z-40 pt-20 px-6 overflow-y-auto lg:hidden">
          <ul className="space-y-4">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollTo(section.id)}
                  className="text-lg font-medium text-stone-800 w-full text-left py-2 border-b border-stone-100"
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:pl-72 w-full max-w-5xl mx-auto px-6 lg:px-16 py-12 lg:py-20">
        
        {/* Title Block */}
        <header className="mb-20 animate-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-stone-500 uppercase border border-stone-200 rounded-full">
            Xin & Jenny
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif text-stone-900 font-bold leading-tight mb-6">
            Mistral Alignment Analysis: <br/>
            <span className="text-stone-500 font-normal block mt-2 text-2xl lg:text-3xl">
              Evaluating Value Alignment in Mistral’s Open-Weight Mixture of Experts for In-Hospital, Clinician-Facing Diagnostic Decision Support
            </span>
          </h1>
        </header>

        {/* I. Introduction */}
        <section id="intro" className="mb-24">
          <SectionHeader number="I" title="Introduction" icon={BookOpen} />
          
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-stone-900 mb-4">I.1 Why healthcare, and why we must scope it (taxonomy first)</h3>
              <p className="text-stone-600 mb-6 max-w-2xl">
                We define our scope by intersecting healthcare contexts with task types. Our focus is strictly on <strong>In-hospital + Clinician-facing diagnostic decision support</strong>.
              </p>
              <TaxonomyGrid />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <Card title="I.2 The Alignment Stress Test">
                Diagnostic support sits inside a <strong>tight accountability chain</strong> (clinician responsibility + hospital governance). Regulators and safety guidance emphasize human oversight and the ability to review the <em>basis</em> of recommendations, not just leaderboard accuracy. <Citation id={2} />
              </Card>
              <Card title="I.3 Research Question">
                Does Mistral’s open-weight Mixture of Experts architecture make value alignment stronger or weaker, and does it shift where alignment "lives" (model weights vs institutional governance)?
              </Card>
            </div>

            <HighlightBox title="Thesis" type="accent">
              Mistral does not simply increase or decrease alignment. It <strong>redistributes alignment</strong> from centralized provider control to hospital-level engineering and governance, turning "alignment" into a socio-technical contract that must be actively maintained. <Citation id={3} />
            </HighlightBox>
          </div>
        </section>

        {/* II. Alignment */}
        <section id="alignment" className="mb-24">
          <SectionHeader number="II" title="Defining Alignment" icon={Brain} />
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="font-serif text-xl mb-3 text-stone-800">II.1 Outer Alignment</h3>
              <p className="text-sm text-stone-500 uppercase tracking-wide mb-2">Specification Problem</p>
              <p className="text-stone-600">
                Did we define the <em>right</em> objectives for diagnostic support (safety thresholds, escalation rules, fairness priorities, uncertainty communication)?
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-3 text-stone-800">II.1 Inner Alignment</h3>
              <p className="text-sm text-stone-500 uppercase tracking-wide mb-2">Generalization Problem</p>
              <p className="text-stone-600">
                Given training and deployment, will the system <em>actually</em> pursue those objectives in deployment, including under distribution shift, adversarial prompts, and long-run use?
              </p>
            </div>
          </div>

          <h3 className="font-bold text-stone-900 mb-6">II.2 The Four Dimensions of Human Choice (RICE)</h3>
          <p className="text-stone-600 mb-6">
            RICE does <strong>not</strong> map cleanly to outer vs inner. Instead, each RICE dimension has an Ability Core (technical: what the system can be made to do) and a Choice Shell (normative: what the hospital chooses to demand, fund, and enforce).
          </p>

          <div className="space-y-8">
            <RiceDimension 
              title="I. Robustness"
              question="What Risks Do We Choose to Tolerate?"
              core={
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Goal:</strong> Making models behave consistently under distribution shift, adversarial prompting, and long-run use.</li>
                  <li><strong>Capability:</strong> Preventing 'accidental harm' that occurs because the model generalizes poorly or is easily jailbroken.</li>
                </ul>
              }
              shell={
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Unacceptable Harm:</strong> Which failures 'count' as unacceptable harm? Are we preventing any serious harm, or only harms above some probability/impact threshold?</li>
                  <li><strong>Cost vs. Safety:</strong> Are we okay with rare but extreme harms if robustness costs too much model capability?</li>
                  <li><strong>Equity:</strong> Which populations and tail events do we protect? Do we invest in robustness for edge-case users (minority dialects, weird inputs), or optimize for the majority?</li>
                  <li><strong>Deployment Gate:</strong> How much evidence (evals, red-teaming) do we demand before deployment, and can it block rollout?</li>
                </ul>
              }
              choice="What kinds of risk and fragility do we refuse to accept? How much do we invest in avoiding rare but serious harms?"
            />

            <RiceDimension 
              title="II. Interpretability"
              question="How Much Opacity Do We Accept?"
              core={
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Goal:</strong> Building and using tools to see inside the model's decision-making process.</li>
                  <li><strong>Capability:</strong> Mechanistic interpretability, attribution methods, probes, saliency maps. The technical side says: 'We can build microscopes into models.'</li>
                </ul>
              }
              shell={
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Legitimacy Threshold:</strong> Do we deploy a model that is largely a black box because it performs well? Or do we choose to withhold deployment until a certain level of explanation can be given?</li>
                  <li><strong>High-Stakes Requirement:</strong> For domains like medicine, do we require interpretability as a precondition for use? Or do we allow opaque but 'empirically good' systems?</li>
                  <li><strong>Resource Allocation:</strong> How much resource do we allocate to interpretability vs. pure capability? This is a budget and priority choice.</li>
                </ul>
              }
              choice="Which decisions must remain understandable and contestable? Where do we refuse to delegate into a black box?"
            />

            <RiceDimension 
              title="III. Controllability"
              question="Who Is Allowed to Override the AI, and When?"
              core={
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Goal:</strong> Providing the physical and software mechanisms to exert human will.</li>
                  <li><strong>Capability:</strong> Off-switches, shutdown mechanisms, corrigibility, interruptibility, permissions systems, and the ability to reset/retrain, sandbox, or rate-limit.</li>
                </ul>
              }
              shell={
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Veto Power:</strong> Who holds the 'big red button'? Is it the lab, the regulator, the hospital ethics committee, or the end-user? That is a political choice.</li>
                  <li><strong>Culture:</strong> Do organizations actually empower staff to reject the model’s recommendation, or are they punished implicitly if they do? 'Controllability on paper' is meaningless if the culture discourages using it.</li>
                  <li><strong>Autonomy by Design:</strong> Do we choose to design systems for advisory roles only, or do we put them directly 'in the loop' for consequential actions (e.g., autonomous triage)?</li>
                </ul>
              }
              choice="Have we actually chosen institutional arrangements where humans retain meaningful veto power and responsibility? Who gets to override the AI, under what conditions, with what accountability?"
            />

            <RiceDimension 
              title="IV. Ethicality"
              question="Which Harms and Values Do We Prioritize?"
              core={
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Goal:</strong> Translating human values into executable code.</li>
                  <li><strong>Capability:</strong> Fairness constraints, debiasing algorithms, safety policies, content filters, and formally encoded 'do no harm' rules.</li>
                </ul>
              }
              shell={
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Whose Harms?:</strong> Different cultures, groups, and institutions disagree about what counts as harm, dignity, or justified risk. Choosing a safety policy (what gets blocked, what is allowed) is already a political/moral decision.</li>
                  <li><strong>Value Trade-Offs:</strong> Resolving conflicts among values (e.g., privacy vs. utility, free expression vs. harm reduction, beneficence vs. autonomy). These are resolved by deliberation, not by more data.</li>
                  <li><strong>Caution Level:</strong> How cautious do we choose to be around unknown unknowns? Do we permit dual-use information (bio, cyber), given its helpful vs. harmful potential?</li>
                </ul>
              }
              choice="Which values and harms are encoded, whose voices count, and how are conflicts among values resolved?"
            />
          </div>
          <p className="text-xs text-stone-400 mt-4 text-center">We use National Institute of Standards and Technology Artificial Intelligence Risk Management Framework and its Generative AI profile as shared risk-management scaffolding. <Citation id={3} /></p>
        </section>

        {/* III. Context */}
        <section id="background" className="mb-24">
          <SectionHeader number="III" title="Background Knowledge" icon={Scale} />
          <div className="space-y-6">
            <HighlightBox type="neutral">
              <h4 className="font-bold text-stone-800 mb-2">Workflow Reality Check (Large Language Model access does not automatically help clinicians)</h4>
              <p className="text-stone-600">
                A randomized clinical trial found that giving physicians access to a Large Language Model did <strong>not</strong> significantly improve diagnostic reasoning compared to conventional resources, even though the Large Language Model alone performed well. Implication: integration, incentives, and governance matter as much as model capability. <Citation id={4} />
              </p>
            </HighlightBox>
            
            <div className="pl-4 border-l-2 border-amber-200">
              <h4 className="font-bold text-stone-800 mb-2">Safety failure modes that matter in this cell</h4>
              <ul className="list-disc pl-4 space-y-2 text-stone-600">
                <li>Large Language Models in clinical decision support can be <strong>highly vulnerable to adversarial hallucination attacks</strong>, producing false clinical details without strong safeguards. <Citation id={5} /></li>
                <li>Medical Large Language Models face upstream integrity risks such as <strong>data-poisoning or misinformation propagation</strong>, which changes how we think about robustness and governance. <Citation id={6} /></li>
              </ul>
            </div>
          </div>
        </section>

        {/* IV. Regulatory */}
        <section id="regulatory" className="mb-24">
          <SectionHeader number="IV" title="Regulatory Anchors" icon={Gavel} />
          <div className="grid md:grid-cols-3 gap-6">
            <Card title="🇺🇸 US: FDA" className="bg-stone-50/50">
              <p className="mb-4"><strong>Clinician Clinical Decision Support framing:</strong> FDA’s Clinical Decision Support guidance clarifies oversight boundaries and stresses that clinicians should be able to <strong>independently review the basis</strong> for recommendations, and not rely primarily on the software output for clinical decisions. <Citation id={2} /></p>
              <p><strong>Predetermined Change Control Plans:</strong> For AI that changes over time, FDA guidance on Predetermined Change Control Plans (PCCPs) offers a lifecycle control template (pre-specified change types + evaluation). <Citation id={7} /></p>
            </Card>
            <Card title="🇪🇺 EU: AI Act" className="bg-stone-50/50">
              <p className="mb-4"><strong>Timeline:</strong> The European Union AI Act entered into force <strong>Aug 1, 2024</strong>, with staged applicability and specific dates for different obligations. <Citation id={8} /></p>
              <p><strong>Medical Device Coordination Group:</strong> European Union medical software qualification and classification guidance (MDCG 2019-11 rev.1 update) is relevant when diagnostic-purpose software is treated as medical device software. <Citation id={9} /></p>
            </Card>
            <Card title="🌍 Global: WHO" className="bg-stone-50/50">
              <p>World Health Organization guidance outlines core ethical principles and governance needs for AI in health. <Citation id={10} /></p>
            </Card>
          </div>
        </section>

        {/* V. Structure */}
        <section id="structure" className="mb-24">
          <SectionHeader number="V" title="Structural Differences" icon={Layers} />
          <div className="space-y-12">
            
            {/* Priority 1 */}
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-4">Priority 1: Open Weights</h3>
              <p className="text-stone-600 mb-4">
                <strong>Structural Difference:</strong> The fundamental difference lies in access to model parameters. Mistral (specifically Mixtral 8x7B/8x22B) distributes the actual neural network weights under permissive licenses, allowing for structural modification. Claude provides only an inference interface (API), keeping the model structure and weights inaccessible.
              </p>
              <ComparisonTable 
                headers={['Feature', 'Mistral (Open Family: Mixtral 8x7B / 8x22B)', 'Claude (Baseline: 3.5 Sonnet / Opus)', 'Why It Matters (Structural Impact)']}
                rows={[
                  ['Weight Access', 'Publicly Downloadable: Weights are available via Hugging Face or torrents. Users possess the binary files defining the model\'s intelligence.', 'Inaccessible (Black Box): Weights are held exclusively by Anthropic. Users never see or hold the model binaries.', 'Auditability: You can mathematically inspect Mistral weights for bias or watermarks; you can only behaviorally test Claude.'],
                  ['Modifiability', 'Fine-Tuning Capable: You can structurally alter the weights (e.g., LoRA, QLoRA) to inject new knowledge or change behavior permanently.', 'Prompt Engineering Only: You cannot change the model\'s internal structure. Customization is limited to context window prompting or RAG.', 'Specialization: Mistral can be retrained to become a medical specialist; Claude can only "pretend" to be one via instructions.'],
                  ['Licensing', 'Apache 2.0: Permissive license allows commercial use, modification, and redistribution without royalties.', 'Proprietary/SaaS: License is for usage of the API service only; you do not own the model output in the same structural sense (terms apply).', 'IP Ownership: You build assets with Mistral (a tuned model belongs to you); you rent intelligence from Claude.']
                ]}
              />
              <div className="flex gap-2">
                <Citation id={16} /> <Citation id={17} />
              </div>
            </div>

            {/* Priority 2 */}
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-4">Priority 2: Mixture of Experts (MoE) Routing</h3>
              <p className="text-stone-600 mb-4">
                <strong>Structural Difference:</strong> This refers to the neural architecture itself. Mixtral uses a Sparse Mixture of Experts (SMoE) architecture where a router network dynamically selects specific parameters for each token. While Claude is rumored to use MoE, its architecture is undisclosed and opaque, meaning developers cannot optimize for it.
              </p>
              <ComparisonTable 
                headers={['Feature', 'Mistral (Open Family: Mixtral 8x7B)', 'Claude (Baseline: 3.5 Sonnet / Opus)', 'Why It Matters (Structural Impact)']}
                rows={[
                  ['Architecture', 'Sparse Mixture of Experts (SMoE): Explicitly documented architecture. Has 8 "expert" networks per layer.', 'Undisclosed / Opaque: Anthropic does not release architectural diagrams or parameter counts in their system cards.', 'Transparency: We know how Mixtral "thinks" (routing tokens to experts); Claude\'s internal reasoning mechanism is a trade secret.'],
                  ['Active Parameters', 'Decoupled: For every token generated, it uses only ~13B active parameters out of 47B total.', 'Unknown: Total and active parameter counts are hidden.', 'Inference Latency: Mistral offers the speed of a small model with the knowledge of a large one. You cannot optimize Claude\'s latency structurally.'],
                  ['Routing Mechanism', 'Token-Level Routing: A router network selects the top 2 experts for each token at each layer.', 'Managed Service: Any routing (if it exists) is handled server-side and invisible to the user.', 'Predictability: Developers can analyze which experts are triggering for specific inputs in Mistral to debug performance.']
                ]}
              />
              <div className="flex gap-2">
                <Citation id={12} /> <Citation id={18} />
              </div>
            </div>

            {/* Priority 3 */}
            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-4">Priority 3: Local Deployment</h3>
              <p className="text-stone-600 mb-4">
                <strong>Structural Difference:</strong> This refers to infrastructure and data sovereignty. Mistral is structurally portable; it is a file that can run on any compatible silicon (NVIDIA, Apple Silicon, AMD). Claude is structurally tethered; it is a service that cannot exist outside Anthropic’s (or their partners') data centers.
              </p>
              <ComparisonTable 
                headers={['Feature', 'Mistral (Open Family: Mixtral 8x7B)', 'Claude (Baseline: 3.5 Sonnet / Opus)', 'Why It Matters (Structural Impact)']}
                rows={[
                  ['Hosting Environment', 'Anywhere (Air-Gapped): Can run on a laptop (via Ollama), an on-prem server (via vLLM), or inside a submarine without internet.', 'Cloud-Dependent: Requires constant internet connection to AWS (Bedrock), GCP (Vertex), or Anthropic API.', 'Resilience: Mistral works if the internet cable is cut; Claude stops immediately.'],
                  ['Data Flow', 'Loopback / Local: Data never leaves the physical RAM/VRAM of your machine.', 'Egress Required: Input data must be encrypted and sent over the public internet to a third-party server.', 'Compliance (GDPR/HIPAA): Local deployment simplifies compliance by removing third-party data processors entirely.'],
                  ['Quantization', 'User-Controlled: You can compress the model to 4-bit (GGUF) to fit on smaller consumer hardware (e.g., 24GB VRAM).', 'Fixed: You cannot compress Claude to make it cheaper or faster; you consume it exactly as served.', 'Hardware Accessibility: Mistral can structurally adapt to fit your available hardware; Claude requires you to adapt to their pricing.']
                ]}
              />
              <div className="flex gap-2">
                <Citation id={19} /> <Citation id={20} /> <Citation id={21} />
              </div>
            </div>

          </div>
        </section>

        {/* VI. Pipeline */}
        <section id="pipeline" className="mb-24">
          <SectionHeader number="VI" title="Pipeline Control" icon={ShieldAlert} />
          
          <div className="max-w-3xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-[28px] top-8 bottom-8 w-0.5 bg-stone-200 hidden md:block"></div>

            {/* Step 1 */}
            <div className="relative md:pl-20 mb-12">
              <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-stone-800 rounded-full items-center justify-center text-white font-serif font-bold text-xl z-10 border-4 border-[#FDFCF8]">1</div>
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2 uppercase tracking-wide text-sm">Pre-deployment & Training Levers (Ability Core)</h4>
                <ul className="space-y-4 text-sm text-stone-600 leading-relaxed">
                   <li>
                     <span className="font-bold text-stone-400 mr-2">•</span>
                     Fine-tune open-weight Mistral models using the official open-source finetuning codebase, which provides a lightweight, LoRA-based entrypoint for parameter-efficient fine-tuning and supports integration with ecosystem tooling
                     <a href="https://github.com/mistralai/mistral-finetune" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline mt-1 font-mono text-xs">→ https://github.com/mistralai/mistral-finetune</a>
                   </li>
                   <li>
                     <span className="font-bold text-stone-400 mr-2">•</span>
                     Select model variant prior to deployment
                     <ul className="pl-6 mt-2 space-y-1 text-stone-500">
                       <li>– Base model (pretrained, not instruction-tuned)</li>
                       <li>– Instruct model (instruction-tuned by Mistral)</li>
                     </ul>
                   </li>
                   <li>
                     <span className="font-bold text-stone-400 mr-2">•</span>
                     Configure system prompts, prompt templates, and external guardrail wrappers at the application or orchestration layer
                   </li>
                </ul>
                <div className="flex justify-center mt-4 text-stone-300">
                  <ChevronDown className="w-6 h-6 animate-bounce" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative md:pl-20 mb-12">
              <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-stone-800 rounded-full items-center justify-center text-white font-serif font-bold text-xl z-10 border-4 border-[#FDFCF8]">2</div>
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2 uppercase tracking-wide text-sm">Deployment Levers (Ability Core)</h4>
                <ul className="space-y-4 text-sm text-stone-600 leading-relaxed">
                   <li>
                     <span className="font-bold text-stone-400 mr-2">•</span>
                     Self-deploy inference using Mistral’s official inference library, which provides reference implementations and deployment utilities, and can be integrated with serving frameworks such as vLLM
                     <a href="https://github.com/mistralai/mistral-inference" target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline mt-1 font-mono text-xs">→ https://github.com/mistralai/mistral-inference</a>
                   </li>
                   <li>
                     <span className="font-bold text-stone-400 mr-2">•</span>
                     Enforce runtime constraints at the serving and application layers, including
                     <ul className="pl-6 mt-2 space-y-1 text-stone-500">
                       <li>– Retrieval scope (e.g., document or knowledge access)</li>
                       <li>– Logging and auditability</li>
                       <li>– Rate limiting</li>
                       <li>– Role-based access control</li>
                       <li>– Rollback procedures</li>
                       <li>– Version pinning</li>
                     </ul>
                   </li>
                </ul>
              </div>
            </div>

            {/* Barriers */}
            <div className="relative md:pl-20">
               <div className="hidden md:flex absolute left-0 top-0 w-14 h-14 bg-amber-500 rounded-full items-center justify-center text-white z-10 border-4 border-[#FDFCF8]">
                 <AlertTriangle className="w-6 h-6"/>
               </div>
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-amber-900 mb-4 border-b border-amber-200 pb-2 uppercase tracking-wide text-sm">Practical Barriers (Choice Shell Meets Reality)</h4>
                  <ul className="space-y-2 text-sm text-amber-900/80 font-medium">
                    <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span> Compute and MLOps cost</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span> Availability of evaluation and safety expertise</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span> Red-teaming capacity</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span> Clinician training time</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span> Organizational incentives (throughput pressure vs careful escalation)</li>
                  </ul>
               </div>
            </div>

          </div>
        </section>

        {/* VII. Features */}
        <section id="features" className="mb-24">
          <SectionHeader number="VII" title="Feature Analysis" icon={Layers} />
          <p className="text-stone-600 mb-6">Feature analysis in our cell (each feature = Ability Core + Choice Shell under RICE).</p>
          <FeatureTabs />
        </section>

        {/* IX. Future */}
        <section id="future" className="mb-24">
          <SectionHeader number="IX" title="Future Directions" icon={ArrowRight} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Card title="1. Robustness benchmarks for diagnostic Clinical Decision Support">
              Adversarial hallucination robustness + distribution shift in clinical text workflows. <Citation id={5} />
            </Card>
            <Card title="2. Mixture of Experts transparency and auditing tools">
              Routing audit trails, expert attribution summaries, stability metrics. <Citation id={15} />
            </Card>
            <Card title="3. Certification of modified versions">
              Internal “release gates,” monitoring, rollback discipline aligned with lifecycle-control ideas in U.S. Food and Drug Administration guidance on evolving AI (Predetermined Change Control Plans). <Citation id={7} />
            </Card>
            <Card title="4. Operational culture as a safety control">
              Formal empowerment to override, escalation incentives, documentation norms.
            </Card>
          </div>
        </section>

        {/* X. References */}
        <section id="references" className="pb-20">
          <SectionHeader number="X" title="References" icon={BookOpen} />
          <div className="bg-stone-50 rounded-lg p-6 border border-stone-200">
            <ul className="space-y-3 text-sm text-stone-500">
              {Object.entries(CITATIONS).map(([id, ref]) => (
                <li key={id} className="flex gap-2">
                  <span className="font-bold text-stone-400 min-w-[24px]">[{id}]</span>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 hover:underline break-words flex items-start gap-1">
                    {ref.text} <ExternalLink className="w-3 h-3 mt-0.5 opacity-50"/>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </main>
    </div>
  );
}