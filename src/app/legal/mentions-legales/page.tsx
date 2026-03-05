import { MILAN_NAME } from '@/lib/constants';

export default function MentionsLegalesPage() {
    return (
        <div className="page-container max-w-4xl mx-auto py-32 px-6">
            <h1 className="font-serif text-4xl gold-text mb-12 tracking-widest uppercase">
                Mentions Légales
            </h1>

            <div className="prose prose-invert max-w-none space-y-12 text-white/70 leading-relaxed">
                <section>
                    <h2 className="text-xl font-serif text-white mb-4 border-l-2 border-gold pl-4 uppercase tracking-wider">
                        Éditeur du site
                    </h2>
                    <p>
                        Le site milansky.com (ci-après « le Site ») est édité par :<br />
                        <strong>[NOM PRÉNOM]</strong>, entrepreneur individuel<br />
                        Adresse : [ADRESSE COMPLÈTE]<br />
                        Email : contact@milansky.com<br />
                        Téléphone : [NUMÉRO]<br />
                        SIRET : [NUMÉRO SIRET]<br />
                        Numéro de TVA intracommunautaire : [NUMÉRO OU « Non applicable — régime de franchise en base de TVA (article 293 B du CGI) »]
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-serif text-white mb-4 border-l-2 border-gold pl-4 uppercase tracking-wider">
                        Directeur de la publication
                    </h2>
                    <p>
                        <strong>[NOM PRÉNOM]</strong><br />
                        Email : contact@milansky.com
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-serif text-white mb-4 border-l-2 border-gold pl-4 uppercase tracking-wider">
                        Hébergeur du site
                    </h2>
                    <p>
                        <strong>Vercel Inc.</strong><br />
                        Adresse : 440 N Barranca Ave #4133 Covina, CA 91722<br />
                        Site web : https://vercel.com
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-serif text-white mb-4 border-l-2 border-gold pl-4 uppercase tracking-wider">
                        Propriété intellectuelle
                    </h2>
                    <p>
                        L&apos;ensemble des éléments composant le Site (textes, images, photographies, vidéos, logos, marques, design, interface, code source) est la propriété exclusive de {MILAN_NAME} Sky ou fait l&apos;objet d&apos;une licence d&apos;utilisation. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, de ces contenus sans autorisation écrite préalable est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-serif text-white mb-4 border-l-2 border-gold pl-4 uppercase tracking-wider">
                        Intelligence artificielle
                    </h2>
                    <p>
                        Le Site intègre un système de conversation utilisant l&apos;intelligence artificielle (ci-après « Milan IA »). Les réponses générées par Milan IA sont produites de manière automatisée et ne constituent ni des conseils professionnels, ni des engagements contractuels, ni l&apos;expression d&apos;une personne physique. L&apos;utilisateur reconnaît interagir avec un programme informatique.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-serif text-white mb-4 border-l-2 border-gold pl-4 uppercase tracking-wider">
                        Données personnelles
                    </h2>
                    <p>
                        Le traitement des données personnelles est décrit dans notre Politique de Confidentialité accessible depuis le pied de page du Site. Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de portabilité et d&apos;opposition concernant vos données. Pour exercer ces droits : privacy@milansky.com. Vous pouvez également adresser une réclamation à la CNIL (www.cnil.fr).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-serif text-white mb-4 border-l-2 border-gold pl-4 uppercase tracking-wider">
                        Règlement des litiges
                    </h2>
                    <p>
                        En cas de litige, le consommateur peut recourir gratuitement au service de médiation suivant :<br />
                        [NOM DU MÉDIATEUR DE LA CONSOMMATION]<br />
                        [ADRESSE DU MÉDIATEUR]<br />
                        [SITE WEB DU MÉDIATEUR]<br />
                        Conformément à l&apos;article 14 du Règlement (UE) n°524/2013, la plateforme européenne de règlement en ligne des litiges est accessible à l&apos;adresse : https://ec.europa.eu/consumers/odr
                    </p>
                </section>
            </div>
        </div>
    );
}
