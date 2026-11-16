import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../seo";
import { PAGES, SITE, SITE_URL, type PageMeta } from "../site";
import Breadcrumbs from "../components/Breadcrumbs";

const LegalLayout = ({ meta, title, children }: { meta: PageMeta; title: string; children: ReactNode }) => (
  <div className="min-h-screen bg-nude-50 pt-32 md:pt-40 pb-20 px-5 sm:px-8 md:px-16">
    <Seo meta={meta} />
    <article className="max-w-3xl mx-auto">
      <Breadcrumbs items={[{ name: "Accueil", path: "/" }, { name: title }]} />
      <h1 className="text-5xl md:text-6xl font-serif text-deep-brown mb-12">{title}</h1>
      <div className="space-y-10 text-lg text-deep-brown/85 leading-relaxed [&_h2]:text-3xl [&_h2]:font-serif [&_h2]:text-deep-brown [&_h2]:mb-4 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-terracotta">
        {children}
      </div>
    </article>
  </div>
);

const { address: a, legal: l } = SITE;

export const LegalNotice = () => (
  <LegalLayout meta={PAGES.legal} title="Mentions légales">
    <section>
      <h2>Éditeur du site</h2>
      <p>
        {SITE.practitioner} – {SITE.jobTitle}
        <br />
        {l.status}
        <br />
        {a.street} ({a.complement}), {a.postalCode} {a.city}, France
        <br />
        Téléphone : <a href={`tel:${SITE.phoneE164}`}>{SITE.phoneDisplay}</a>
        {l.email && (
          <>
            <br />
            E-mail : <a href={`mailto:${l.email}`}>{l.email}</a>
          </>
        )}
        {l.siret && (
          <>
            <br />
            SIRET : {l.siret}
          </>
        )}
      </p>
      <p className="mt-4">Directrice de la publication : {SITE.practitioner}.</p>
    </section>

    {l.hostName && (
      <section>
        <h2>Hébergement</h2>
        <p>
          {l.hostName}
          {l.hostAddress && (
            <>
              <br />
              {l.hostAddress}
            </>
          )}
          {l.hostPhone && (
            <>
              <br />
              Téléphone : {l.hostPhone}
            </>
          )}
        </p>
      </section>
    )}

    <section>
      <h2>Propriété intellectuelle</h2>
      <p>
        L’ensemble des contenus de ce site ({SITE_URL.replace(/^https?:\/\//, "")}) – textes, logo, mise en page – est
        la propriété de {SITE.practitioner}, sauf mention contraire. Certaines photographies proviennent de banques
        d’images libres de droits. Toute reproduction sans autorisation préalable est interdite.
      </p>
    </section>

    <section>
      <h2>Avertissement</h2>
      <p>
        La kinésiologie est une technique de bien-être et d’accompagnement. Elle ne relève pas de la médecine : elle ne
        pose aucun diagnostic, ne prescrit aucun traitement et ne se substitue en aucun cas à une consultation médicale
        ou à un traitement en cours.
      </p>
    </section>

    <section>
      <h2>Réservation en ligne</h2>
      <p>
        La prise de rendez-vous est assurée par le service BookingFast. Les données saisies lors de la réservation sont
        traitées conformément à notre <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>
    </section>
  </LegalLayout>
);

export const Privacy = () => (
  <LegalLayout meta={PAGES.privacy} title="Politique de confidentialité">
    <section>
      <h2>Responsable du traitement</h2>
      <p>
        {SITE.practitioner}, {a.street}, {a.postalCode} {a.city}. Pour toute question relative à vos données, vous
        pouvez la contacter au <a href={`tel:${SITE.phoneE164}`}>{SITE.phoneDisplay}</a>
        {l.email && (
          <>
            {" "}
            ou par e-mail à <a href={`mailto:${l.email}`}>{l.email}</a>
          </>
        )}
        .
      </p>
    </section>

    <section>
      <h2>Données collectées</h2>
      <p>
        Ce site ne comporte pas de formulaire de contact et ne dépose pas de cookie publicitaire ni de mesure
        d’audience. Les seules données personnelles collectées sont celles que vous transmettez volontairement :
      </p>
      <ul className="list-disc pl-6 mt-4 space-y-2">
        <li>lors d’une réservation en ligne (nom, prénom, téléphone, e-mail, créneau choisi) via le module BookingFast ;</li>
        <li>lorsque vous contactez le cabinet par téléphone ou WhatsApp.</li>
      </ul>
    </section>

    <section>
      <h2>Finalités et base légale</h2>
      <p>
        Ces données servent uniquement à organiser et suivre vos rendez-vous (exécution d’un service demandé). Elles ne
        sont jamais vendues ni cédées à des tiers à des fins commerciales.
      </p>
    </section>

    <section>
      <h2>Durée de conservation</h2>
      <p>
        Les données liées aux rendez-vous sont conservées pendant la durée de la relation, puis au maximum trois ans
        après le dernier contact, sauf obligation légale de conservation plus longue (pièces comptables).
      </p>
    </section>

    <section>
      <h2>Services tiers</h2>
      <p>
        Le module de réservation (BookingFast), WhatsApp et Google Maps sont des services tiers qui disposent de leur
        propre politique de confidentialité. Ils ne sont chargés que lorsque vous les ouvrez. Les polices de caractères
        sont hébergées directement sur ce site : aucune donnée n’est transmise à Google Fonts.
      </p>
    </section>

    <section>
      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD et à la loi « Informatique et Libertés », vous disposez d’un droit d’accès, de
        rectification, d’effacement, d’opposition, de limitation et de portabilité de vos données. Pour les exercer,
        contactez le cabinet. Vous pouvez également introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
          www.cnil.fr
        </a>
        ).
      </p>
    </section>
  </LegalLayout>
);
