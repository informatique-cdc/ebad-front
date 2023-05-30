import {AuthService} from './oauth.service';
import {InitAuthConfigService} from '../core/services/init-oauth-config.service';
import {InitConfigService} from '../core/services/init-config.service';

export function authAppInitializerFactory(authService: AuthService, initAuthConfigService: InitAuthConfigService, initConfigService: InitConfigService): () => Promise<void> {
  return () => initConfigService.loadConfig()
    .then(() => {
      return initAuthConfigService.loadConfig();
    })
    .then((authConfig) =>  authService.configure(authConfig))
    .then(() => authService.runInitialLoginSequence());
}
