import {ValidationHandler, ValidationParams} from 'angular-oauth2-oidc';
// import * as rs from 'angular-oauth2-oidc/node_modules/jsrsasign'; Je ne sais pas pourquoi ça a pété du jour au lendemain...
import * as rs from 'jsrsasign';
import {ConfigService} from "../core/services/config.service";

export class CustomValidationHandler implements ValidationHandler {
  configService: ConfigService;
  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  static calcHash(valueToHash: string, algorithm: string): string {
    const hashAlg = new rs.KJUR.crypto.MessageDigest({alg: algorithm});
    const result = hashAlg.digestString(valueToHash);
    return this.toByteArrayAsString(result);
  }

  static toByteArrayAsString(hexString: string) {
    let result = '';
    for (let i = 0; i < hexString.length; i += 2) {
      const hexDigit = hexString.charAt(i) + hexString.charAt(i + 1);
      const num = parseInt(hexDigit, 16);
      result += String.fromCharCode(num);
    }
    return result;
  }

  /**
   * Infers the name of the hash algorithm to use
   * from the alg field of an id_token.
   *
   * @param jwtHeader the id_token's parsed header
   */
  protected static inferHashAlgorithm(jwtHeader: any): string {
    const alg: string = jwtHeader.alg;

    if (!alg.match(/^.S[0-9]{3}$/)) {
      throw new Error('Algorithm not supported: ' + alg);
    }

    return 'sha' + alg.substr(2);
  }

  validateSignature(validationParams: ValidationParams): Promise<any> {
    return Promise.resolve(null);
  }

  validateAtHash(params: ValidationParams): Promise<boolean> {
    if (!params.accessToken || !params.idTokenClaims || !params.idTokenClaims[this.configService.atHash]) {
      return Promise.resolve(false);
    }

    const hashAlg = CustomValidationHandler.inferHashAlgorithm(params.idTokenHeader);

    const tokenHash = CustomValidationHandler.calcHash(params.accessToken, hashAlg);
    const leftMostHalf = tokenHash.substr(0, tokenHash.length / 2);
    const tokenHashBase64 = btoa(leftMostHalf);
    const claimsAtHash = params.idTokenClaims[this.configService.atHash].replace(/=/g, '');
    const atHash = tokenHashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    if (atHash !== claimsAtHash) {
      console.error('>>> exptected at_hash: ' + atHash);
      console.error('>>> actual at_hash: ' + claimsAtHash);
    }

    return Promise.resolve(atHash === claimsAtHash);
  }
}
