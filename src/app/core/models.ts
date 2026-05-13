export type RoleName =
  | 'CLIENT'
  | 'SUPPORT_AGENT'
  | 'BACK_OFFICE_OPERATOR'
  | 'ADMINISTRATOR'
  | 'SUPER_ADMINISTRATOR';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
  roles: RoleName[];
  permissions: string[];
}

export interface AuthChallenge {
  requires2fa: boolean;
  challengeId: string;
  previewCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
