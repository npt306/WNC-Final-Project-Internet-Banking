import { Module } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000, // Set timeout (5 seconds)
      maxRedirects: 5, // Maximum number of redirects
      baseURL: 'https://api.example.com', // Default base URL for requests
    }),
  ],
  controllers: [],
  providers: [AxiosService],
  exports: [AxiosService]
})
export class AxiosModule {}
