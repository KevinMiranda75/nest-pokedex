import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly  axios: AxiosInstance = axios;

  async executSeed() {
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=5');

    data.results.forEach(({name, url}) => {
      const segment = url.split('/')
      const no = +segment[ segment.length - 2 ];
      console.log(name +' - ' + no) ; 
    })

    return data.results;
  }

}
