import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../config/jwt.config';
import { GoogleTokenDto } from './dtos/google-token.dto';
import { UsersService } from 'src/users/users.service';
import { GenerateTokensProvider } from '../generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  constructor(
    //inject jwtConfiguration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigurattion: ConfigType<typeof jwtConfig>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  private oauthClient: OAuth2Client;

  //when the Auth module is instantiated, I want this property [private oauthClient: OAuth2Client;] to be initialized
  onModuleInit() {
    const clientId = this.jwtConfigurattion.googleClientId;
    const clientSecret = this.jwtConfigurattion.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      //verify the Google token sent by user
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });
      //extract the payload from Google JWT
      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = loginTicket.getPayload();
      //console.log('user');

      //Find user in the database using google Id

      const user = await this.usersService.findOneByGoogleId(googleId);

      //If googleId exists, generate token
      if (user) {
        return await this.generateTokensProvider.generateTokens(user);
      }

      //If not, create a new user and then generate tokens
      const newUser = await this.usersService.createGoogleUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        googleId: googleId,
      });
      console.log(newUser);
      return this.generateTokensProvider.generateTokens(newUser);
    } catch (error) {
      //throw unauthorised exception
      throw new UnauthorizedException(error);
    }
  }
}
