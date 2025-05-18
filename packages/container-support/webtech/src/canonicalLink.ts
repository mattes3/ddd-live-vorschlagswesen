const startOfUrl = (req: Request) => {
    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
};

export function canonicalLink(req: Request) {
    return `${startOfUrl(req)}${new URL(req.url).pathname}`;
}

type PageMetaInput = {
    title: string;
    description: string;
    ogImagePath?: string;
};

type PageMetaInformation = PageMetaInput & {
    actualYearNumber: number;
    hostName: string;
    canonicalLink: string;
    logoPath: string;
    shareableTwitterLink: string;
    shareableRedditLink: string;
    shareableFacebookLink: string;
    shareableLinkedinLink: string;
    shareableText: string;
    twitterName: string;
    twitterUrl: string;
};

export const actualYearNumber = new Date().getFullYear();

export function pageMeta(
    req: Request,
    { title, description, ogImagePath }: PageMetaInput,
): PageMetaInformation {
    const host = req.headers.get('host') as string;
    const urlStart = startOfUrl(req);
    const twitterName = 'vorschlagswesen';
    const canonical = canonicalLink(req);

    const today = new Date()
        .toISOString()
        .replace(/[-.:Z]/g, '')
        .substring(0, 15);

    const medium = 'social';
    const mediumKey = medium.substring(0, 2).toUpperCase();

    const shareableLink = (source: string) => {
        const sourceKey = source.substring(0, 2).toUpperCase();
        const term = `${mediumKey}${sourceKey}${today}`;

        return encodeURIComponent(
            `${canonical}?utm_term=${term}&utm_medium=${medium}&utm_source=${source}`,
        );
    };

    return {
        actualYearNumber,
        canonicalLink: canonical,
        description,
        hostName: host,
        logoPath: `${urlStart}/android-chrome-192x192.png`,
        ogImagePath: `${urlStart}${
            ogImagePath ?? '/uploaded-image/static/happy-about-vorschlagswesen.jpg'
        }`,
        shareableTwitterLink: shareableLink('Twitter'),
        shareableRedditLink: shareableLink('Reddit'),
        shareableFacebookLink: shareableLink('Facebook'),
        shareableLinkedinLink: shareableLink('Linkedin'),
        shareableText: encodeURIComponent(title),
        title: `${title} | ${host}`,
        twitterName,
        twitterUrl: `https://twitter.com/${twitterName}`,
    };
}
