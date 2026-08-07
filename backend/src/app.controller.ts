import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getHello() {
    return {
      name: "Nexora",
      message: "Je suis ton intelligence opérationnelle.",
      version: "0.1"
    };
  }

}