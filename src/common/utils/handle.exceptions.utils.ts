import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

export const handleExceptions = (error: any) => {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists in db ${JSON.stringify(error.keyValue)}`);
    }

    throw new InternalServerErrorException(`Can't create pokemon - check server logs ${error.message}`);
}