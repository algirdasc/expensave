import {Injectable} from '@angular/core';
import {User} from '../../api/entities/user.entity';

@Injectable()
export class MainService {
    public user: User;
}