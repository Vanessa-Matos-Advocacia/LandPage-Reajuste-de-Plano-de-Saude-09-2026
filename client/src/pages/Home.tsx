/**
 * Design: Serenidade Estrutural — editorial jurídico premium em preto, cinza e Azul Vanessa.
 * Princípios: autoridade calma, assimetria controlada, contraste suave e símbolo como arquitetura.
 */
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  HeartPulse,
  Menu,
  Scale,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

const assets = {
  logo: "/manus-storage/vanessa-matos-logo-negativo_63f4e01b.png",
  stackedLogo: "/manus-storage/vanessa-matos-logo-empilhado-negativo_d24c290c.png",
  officialSymbol: "/manus-storage/vanessa-matos-simbolo-positivo_02e085da.webp",
  hero: "/manus-storage/vanessa-hero-saude-juridico_1b10ff35.jpg",
  data: "/manus-storage/vanessa-reajuste-dados_d9397d50.jpg",
  consult: "/manus-storage/vanessa-conversa-acolhedora_d97e121d.jpg",
  pattern: "/manus-storage/vanessa-pattern-abstrato_bc1bf2da.png",
  headerSeal: "/manus-storage/vanessa-favicon-motif_e306e033.png",
};

const years = Array.from({ length: 28 }, (_, index) => new Date().getFullYear() - index);

const faqs = [
  {
    question: "Quando um reajuste do plano merece uma análise?",
    answer:
      "A análise depende do contrato, da modalidade, do histórico de mensalidades e da forma como o percentual foi apresentado. Um aumento expressivo, sem explicação clara ou que comprometa a permanência da família no plano, costuma justificar a leitura cuidadosa da documentação.",
  },
  {
    question: "Planos coletivos também podem ser avaliados?",
    answer:
      "Sim. Planos coletivos por adesão e empresariais possuem regras e dinâmicas próprias. Quando são contratados em contexto essencialmente familiar ou quando os índices não são esclarecidos de forma suficiente, uma avaliação jurídica individualizada pode ser importante.",
  },
  {
    question: "O reajuste por faixa etária pode ser discutido?",
    answer:
      "A validade de reajustes por faixa etária exige a leitura da previsão contratual, da metodologia aplicada e do impacto concreto no caso. A análise deve ser feita com atenção especial a aumentos que tornem a continuidade do plano inviável.",
  },
  {
    question: "Quais documentos ajudam na avaliação inicial?",
    answer:
      "Normalmente são úteis a carteirinha, o contrato ou proposta de adesão, os boletos antes e depois do aumento, comunicados da operadora e qualquer demonstrativo que indique o índice aplicado. A equipe poderá orientar os documentos adequados ao seu caso.",
  },
  {
    question: "A ferramenta de triagem substitui uma consulta?",
    answer:
      "Não. A calculadora organiza informações básicas e mostra pontos de atenção gerais. Uma orientação segura depende da análise individual do contrato e dos documentos por profissional habilitado.",
  },
];

type TriageResult = {
  annualRate: number;
  tone: "neutral" | "attention" | "relevant";
  heading: string;
  message: string;
};

const parseMoney = (value: string) => {
  const cleaned = value.replace(/[^0-9,.-]/g, "");
  const separatorIndex = Math.max(cleaned.lastIndexOf(","), cleaned.lastIndexOf("."));

  if (separatorIndex < 0) return Number(cleaned.replace(/[^0-9]/g, ""));

  const integerPart = cleaned.slice(0, separatorIndex).replace(/[.,]/g, "");
  const decimalPart = cleaned.slice(separatorIndex + 1).replace(/[.,]/g, "");
  return Number(`${integerPart}.${decimalPart}`);
};

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tipoPlano, setTipoPlano] = useState("");
  const [anoInicio, setAnoInicio] = useState("");
  const [mensalidadeInicial, setMensalidadeInicial] = useState("");
  const [mensalidadeAtual, setMensalidadeAtual] = useState("");
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const currentYear = new Date().getFullYear();

  const formattedInitial = useMemo(() => parseMoney(mensalidadeInicial), [mensalidadeInicial]);
  const formattedCurrent = useMemo(() => parseMoney(mensalidadeAtual), [mensalidadeAtual]);

  const handleTriage = () => {
    if (!tipoPlano || !anoInicio || !formattedInitial || !formattedCurrent || !consent) {
      toast.error("Complete os campos da triagem", {
        description: "Selecione a modalidade, informe os valores, o ano de início e confirme a ciência do aviso.",
      });
      return;
    }

    if (formattedCurrent < formattedInitial) {
      setResult({
        annualRate: 0,
        tone: "neutral",
        heading: "O valor atual está abaixo da mensalidade informada no início.",
        message:
          "Isso não impede a análise contratual, mas a triagem de aumento anual não identificou variação positiva com os dados inseridos.",
      });
      return;
    }

    const elapsedYears = Math.max(1, currentYear - Number(anoInicio));
    const annualRate = (Math.pow(formattedCurrent / formattedInitial, 1 / elapsedYears) - 1) * 100;

    if (annualRate > 10) {
      setResult({
        annualRate,
        tone: "relevant",
        heading: "Há um ponto de atenção relevante para verificar.",
        message:
          "A evolução média informada é elevada para uma leitura preliminar. Separe seus boletos e comunicados para que o histórico, a modalidade e as cláusulas possam ser conferidos com atenção.",
      });
    } else if (annualRate > 6) {
      setResult({
        annualRate,
        tone: "attention",
        heading: "Os dados indicam um ponto de atenção inicial.",
        message:
          "A variação média merece ser comparada com o contrato, com os comunicados recebidos e com as características do plano. Uma avaliação individual pode esclarecer o cenário.",
      });
    } else {
      setResult({
        annualRate,
        tone: "neutral",
        heading: "A triagem não encontrou um sinal expressivo apenas pelos valores informados.",
        message:
          "Ainda assim, a modalidade do contrato, a forma de aplicação do aumento e outros reajustes podem ser relevantes. Esta ferramenta não substitui uma análise jurídica individual.",
      });
    }
  };

  return (
    <main id="conteudo" className="site-shell overflow-hidden bg-[#0a0b0b] text-white">
      <a className="skip-link" href="#inicio">Pular para o conteúdo principal</a>
      <header className="site-header">
        <div className="site-container flex items-center justify-between gap-5">
          <button
            className="brand-lockup"
            aria-label="Voltar ao início"
            onClick={() => scrollTo("inicio")}
          >
            <img className="brand-logo" src={assets.stackedLogo} alt="Vanessa Matos Advocacia" />
            <img className="brand-seal" src={assets.headerSeal} alt="" aria-hidden="true" />
          </button>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            <button className="nav-link" onClick={() => scrollTo("entenda")}>Entenda o cenário</button>
            <button className="nav-link" onClick={() => scrollTo("triagem")}>Faça a triagem</button>
            <button className="nav-link" onClick={() => scrollTo("duvidas")}>Dúvidas frequentes</button>
          </nav>

          <button className="header-cta hidden sm:inline-flex" onClick={() => scrollTo("triagem")}>
            Fazer a triagem <ArrowUpRightIcon />
          </button>
          <button
            className="mobile-menu-button lg:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav site-container lg:hidden" aria-label="Navegação móvel">
            <button onClick={() => { setMenuOpen(false); scrollTo("entenda"); }}>Entenda o cenário</button>
            <button onClick={() => { setMenuOpen(false); scrollTo("triagem"); }}>Faça a triagem</button>
            <button onClick={() => { setMenuOpen(false); scrollTo("duvidas"); }}>Dúvidas frequentes</button>
            <button onClick={() => { setMenuOpen(false); scrollTo("triagem"); }}>Fazer a triagem</button>
          </nav>
        )}
      </header>

      <section id="inicio" className="hero-section">
        <div className="hero-image" style={{ backgroundImage: `url(${assets.hero})` }} aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="site-container hero-grid relative z-10">
          <div className="hero-copy">
            <div className="hero-brand-register">
              <img src={assets.stackedLogo} alt="" aria-hidden="true" />
              <span>Orientação jurídica informativa</span>
            </div>
            <div className="eyebrow"><span />Direito à saúde · orientação estratégica</div>
            <h1>Seu plano ficou mais caro. <em>Antes de aceitar o aumento, entenda o que pode ser analisado.</em></h1>
            <p className="hero-intro">
              Reajustes de planos de saúde envolvem contrato, modalidade, histórico e transparência. Nossa página ajuda você a organizar as informações e identificar os primeiros pontos de atenção.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => scrollTo("triagem")}>
                Verificar meu reajuste <ArrowRight size={17} />
              </button>
              <button className="text-button" onClick={() => scrollTo("documentos")}>
                Ver documentos úteis <ArrowDownRight size={17} />
              </button>
            </div>
          </div>

          <aside className="hero-note">
            <div className="note-symbol"><HeartPulse size={23} strokeWidth={1.45} /></div>
            <p className="note-kicker">Decisões importantes pedem contexto.</p>
            <p className="note-copy">A primeira etapa é entender o histórico com calma, sem promessas e sem decisões automatizadas.</p>
            <button onClick={() => scrollTo("triagem")} className="note-link">Começar pela triagem <ChevronRight size={15} /></button>
          </aside>
        </div>
        <div className="hero-index site-container" aria-hidden="true"><span>01</span><div /><span>REAJUSTE DE PLANO DE SAÚDE</span></div>
      </section>

      <section id="triagem" className="triage-section">
        <div className="site-container triage-layout">
          <div className="triage-intro">
            <div className="section-number">02 <span>Triagem inicial</span></div>
            <h2>Comece pelos dados que o seu contrato já revela.</h2>
            <p>Em poucos campos, você organiza o histórico básico da mensalidade. O resultado serve como referência preliminar para decidir se vale reunir documentos e buscar uma leitura individual.</p>
            <div className="triage-facts">
              <span><Check size={16} /> Leitura preliminar e informativa</span>
              <span><Check size={16} /> Sem promessa ou automatização de resultado</span>
              <span><Check size={16} /> Valores calculados apenas no seu navegador</span>
            </div>
          </div>

          <div className="triage-card">
            <div className="triage-card-heading">
              <div>
                <p className="card-label">Instrumento de orientação preliminar</p>
                <h3>Leitura inicial do reajuste</h3>
              </div>
              <img src={assets.officialSymbol} alt="" aria-hidden="true" />
            </div>
            <div className="form-grid">
              <label>
                <span>Tipo de plano</span>
                <select value={tipoPlano} onChange={(event) => setTipoPlano(event.target.value)}>
                  <option value="">Selecione a modalidade</option>
                  <option value="individual">Individual</option>
                  <option value="familiar">Familiar</option>
                  <option value="adesao">Coletivo por adesão</option>
                  <option value="empresarial">Empresarial / CNPJ</option>
                </select>
              </label>
              <label>
                <span>Ano de início do contrato</span>
                <select value={anoInicio} onChange={(event) => setAnoInicio(event.target.value)}>
                  <option value="">Selecione o ano</option>
                  {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </label>
              <label>
                <span>Mensalidade no início</span>
                <input inputMode="decimal" value={mensalidadeInicial} onChange={(event) => setMensalidadeInicial(event.target.value)} placeholder="Ex.: 750,00" />
              </label>
              <label>
                <span>Mensalidade atual</span>
                <input inputMode="decimal" value={mensalidadeAtual} onChange={(event) => setMensalidadeAtual(event.target.value)} placeholder="Ex.: 1.450,00" />
              </label>
            </div>
            <label className="consent-row">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>Entendo que esta é uma referência informativa e não substitui a análise jurídica do caso.</span>
            </label>
            <button className="primary-button calculate-button" onClick={handleTriage}>
              Ver minha triagem <ArrowRight size={17} />
            </button>
            <p className="form-disclaimer">A estimativa considera apenas os valores e o período informados. Contrato, faixa etária, modalidade e comunicados da operadora podem alterar a avaliação.</p>
            <p className="privacy-brief"><ShieldCheck size={13} /> Esta página não solicita dados identificáveis. Os valores permanecem no navegador durante a sua navegação.</p>

            {result && (
              <div className={`result-panel result-${result.tone}`} aria-live="polite">
                <div className="result-topline"><span>Resultado de referência</span><strong>{result.annualRate ? `${result.annualRate.toFixed(1).replace(".", ",")}% a.a.` : "Histórico informado"}</strong></div>
                <h4>{result.heading}</h4>
                <p>{result.message}</p>
                <button className="result-link" onClick={() => scrollTo("documentos")}>Ver documentos que ajudam na análise <ArrowRight size={15} /></button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="entenda" className="context-section">
        <div className="site-container">
          <div className="context-heading">
            <div className="section-number section-number-light">03 <span>O que observar</span></div>
            <p className="section-sidecopy">Nem todo aumento tem a mesma origem. A leitura correta começa ao diferenciar modalidade, histórico e explicação apresentada pela operadora.</p>
            <h2>O reajuste que pesa no orçamento pode ter uma história mais complexa do que parece.</h2>
          </div>

          <div className="signal-grid">
            <article className="signal-card signal-card-dark">
              <span className="signal-index">A</span>
              <Scale size={28} strokeWidth={1.25} />
              <h3>Percentual sem explicação clara</h3>
              <p>Quando o aumento chega sem demonstrativo compreensível, critérios objetivos ou comunicação suficiente, a documentação merece atenção.</p>
            </article>
            <article className="signal-card signal-card-blue">
              <span className="signal-index">B</span>
              <FileText size={28} strokeWidth={1.25} />
              <h3>Contrato coletivo em contexto familiar</h3>
              <p>A forma de contratação, o número de beneficiários e o vínculo com a empresa ou entidade podem ser relevantes para a análise.</p>
            </article>
            <article className="signal-card signal-card-light">
              <span className="signal-index">C</span>
              <ShieldCheck size={28} strokeWidth={1.25} />
              <h3>Faixa etária ou contrato antigo</h3>
              <p>Regras de idade, contratos anteriores à regulação atual e aumentos cumulativos exigem leitura individual das cláusulas e do histórico.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="documentos" className="evidence-section">
        <div className="site-container evidence-layout">
          <div className="evidence-visual">
            <img src={assets.data} alt="Documentos e gráficos abstratos representando a análise de dados contratuais" />
            <div className="image-caption"><span>DOCUMENTAÇÃO</span><span>LEITURA TÉCNICA</span></div>
          </div>
          <div className="evidence-copy">
            <div className="eyebrow eyebrow-dark"><span />Uma análise não começa com uma conclusão</div>
            <h2>Começa com os documentos que dão contexto ao caso.</h2>
            <p>Uma orientação responsável observa como o plano foi contratado, quais foram os reajustes ao longo do tempo e de que modo os percentuais foram apresentados. É a combinação desses elementos que dá contexto à leitura inicial.</p>
            <div className="evidence-list">
              <div><span>01</span><p><strong>Contrato e proposta de adesão</strong> para entender a modalidade e as cláusulas aplicáveis.</p></div>
              <div><span>02</span><p><strong>Boletos e comunicados de reajuste</strong> para mapear a evolução da mensalidade.</p></div>
              <div><span>03</span><p><strong>Perfil dos beneficiários</strong> para considerar fatores que exigem análise específica.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="site-container process-layout">
          <div className="process-lead">
            <div className="section-number section-number-light">04 <span>Próximos passos</span></div>
            <h2>Uma rota clara, do documento à conversa.</h2>
          </div>
          <div className="process-steps">
            <article><span>1</span><h3>Organize o histórico</h3><p>Reúna contrato, boletos e comunicações que ajudem a entender o aumento.</p></article>
            <article><span>2</span><h3>Faça a triagem</h3><p>Use a ferramenta acima para estruturar os valores e o tempo de contrato.</p></article>
            <article><span>3</span><h3>Prepare a próxima conversa</h3><p>Com seu histórico organizado, você estará mais preparado para solicitar orientação individual pelos canais oficiais do escritório.</p></article>
          </div>
        </div>
      </section>

      <section id="duvidas" className="faq-section">
        <div className="site-container faq-layout">
          <div className="faq-intro">
            <div className="section-number">05 <span>Perguntas frequentes</span></div>
            <h2>Informação para você decidir com mais clareza.</h2>
            <p>Reunimos dúvidas que costumam surgir antes de uma análise. Cada resposta é geral; os detalhes dependem do contrato e da situação vivida por cada família.</p>
            <button className="text-button text-button-dark" onClick={() => scrollTo("triagem")}>Revisar meus dados na triagem <ArrowRight size={16} /></button>
          </div>
          <Accordion type="single" collapsible className="faq-accordion">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-image" style={{ backgroundImage: `url(${assets.consult})` }} aria-hidden="true" />
        <div className="closing-overlay" aria-hidden="true" />
        <div className="site-container closing-content relative z-10">
          <div className="closing-symbol"><Sparkles size={18} strokeWidth={1.2} /> Vanessa Matos Advocacia</div>
          <h2>Seu caso merece ser compreendido antes de qualquer decisão.</h2>
          <p>Organize suas informações, entenda os pontos que podem ser avaliados e prepare seu histórico para uma conversa jurídica individual, quando decidir avançar.</p>
          <div className="hero-actions">
            <button className="primary-button primary-button-light" onClick={() => scrollTo("documentos")}>Organizar documentos <ArrowRight size={17} /></button>
            <button className="text-button text-button-light" onClick={() => scrollTo("triagem")}>Fazer a triagem <ArrowUpRightIcon /></button>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-container footer-grid">
          <div>
            <img className="footer-logo" src={assets.stackedLogo} alt="Vanessa Matos Advocacia" />
            <p>Direito à saúde com escuta, precisão e orientação estratégica.</p>
          </div>
          <div className="footer-note">
            <p className="footer-label">PRIVACIDADE DA TRIAGEM</p>
            <p>Esta página não solicita dados identificáveis na triagem. Os valores inseridos servem apenas para produzir a referência apresentada na própria tela.</p>
          </div>
          <div className="footer-links">
            <button onClick={() => scrollTo("inicio")}>Início</button>
            <button onClick={() => scrollTo("triagem")}>Triagem</button>
            <button onClick={() => scrollTo("documentos")}>Documentos</button>
          </div>
        </div>
        <div className="site-container footer-bottom"><span>© {currentYear} Vanessa Matos Advocacia. Todos os direitos reservados.</span><span>Conteúdo informativo · análise individual necessária.</span></div>
      </footer>
    </main>
  );
}

function ArrowUpRightIcon() {
  return <ArrowDownRight size={16} className="-rotate-90" />;
}
