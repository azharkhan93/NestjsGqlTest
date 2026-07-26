export class CurrentUserPayload {
  sub: string;
  role?: string | { id?: string; name: string };
  email?: string;
  id?: string;
}
