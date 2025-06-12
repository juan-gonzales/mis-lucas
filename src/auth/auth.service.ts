import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export interface AuthenticatedUser {
  userId: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Placeholder method
  validateUser(username: string, pass: string): AuthenticatedUser | null {
    void username;
    void pass;
    return null;
  }

  async login(user: AuthenticatedUser): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
