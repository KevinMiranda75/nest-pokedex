import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit:number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = configService.getOrThrow('defaultLimit')
   }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.charAt(0).toUpperCase() + createPokemonDto.name.slice(1).toLowerCase();
      const newPokemonDB = await this.pokemonModel.create(createPokemonDto)
      return newPokemonDB;
    } catch (error) {
      this.handleErrorExc(error);
    }

  }

  async findAll(paginationDto:PaginationDto) {
    const { limit = this.defaultLimit, page = 0 } = paginationDto;
    const offset = page * limit;
    return await this.pokemonModel.find().limit(limit).skip(offset).select('-__v');
  }

  async findOne(id: string) {
    let pokemon;

    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }

    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: id.charAt(0).toUpperCase() + id.slice(1).toLowerCase() });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with, not found ${id}`)
    }
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const updatePokemon = await this.findOne(id);
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.charAt(0).toUpperCase() + updatePokemonDto.name.slice(1).toLowerCase()
      }

      await updatePokemon.updateOne(updatePokemonDto, { new: true })
      return { ...updatePokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleErrorExc(error);
    }

  }

  async remove(id: string) {
    const resultDelete = await this.pokemonModel.findByIdAndDelete(id);
    if (!resultDelete) throw new BadRequestException(`Pokemon by ${id} is not found`)
    // const  { deletedCount }  = await this.pokemonModel.deleteOne({ _id: id })
    // if (deletedCount === 0) throw new BadRequestException(`Pokemon by ${id} is not found`)
    return `Pokemon Eliminado correctamente ${id}`;
  }

  private handleErrorExc(error: any) {
    console.log(error)
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon false Update ${JSON.stringify(error.keyValue)} `)
    }
    throw new InternalServerErrorException(' Can t  Create Pokemon - view logs')
  }
}
