import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { handleExceptions } from 'src/common/utils/handle.exceptions.utils';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}
  

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const createPokemonDtos: CreatePokemonDto[] = [];
    data.results.forEach(({name, url}) => {
      
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      createPokemonDtos.push({no, name: name.toLowerCase()});

    });

    try {
      await this.pokemonModel.insertMany(createPokemonDtos);
    } catch (error) {
      handleExceptions(error);
    }

    return data.results;
  }

}
