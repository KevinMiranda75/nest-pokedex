import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) { }

  async executSeed() {
    await this.pokemonModel.deleteMany({});

    const data  = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=100');

    const pokemonToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return { name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(), no };
    });

    return await this.pokemonModel.insertMany(pokemonToInsert);
  }

}
