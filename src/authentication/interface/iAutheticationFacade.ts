import { Observable } from 'rxjs';
import { UserModel } from '../model/user';

export interface iAuthenticationFacade {
	getCurrentUser(): Observable<UserModel>;

	login(
		username: string,
		password: string,
		url: string,
		authenticationString: string
	): Promise<boolean>;

	isLoggedIn: boolean;

	logout(): void;

	getToken(url: string, authorizationString: string): Promise<string>;
}
