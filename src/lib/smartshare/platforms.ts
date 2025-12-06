export type PlatformKey = 'linkedin' | 'twitter' | 'reddit' | 'facebook' | 'medium';

export const PLATFORM_META: Record<
PlatformKey,
{ id: PlatformKey; label: string; iconEmoji: string }
> = {
    linkedin: { id: 'linkedin', label: 'LinkedIn',  iconEmoji: '🔗' },
    twitter: { id: 'twitter', label: 'X (Twitter)', iconEmoji: '🐦' },
    reddit: { id: 'reddit', label: 'Reddit', iconEmoji: '👽' },
    facebook: { id: 'facebook', label: 'Facebook', iconEmoji: '📘' },
    medium: { id: 'medium', label: 'Medium', iconEmoji: '✍️' },
}