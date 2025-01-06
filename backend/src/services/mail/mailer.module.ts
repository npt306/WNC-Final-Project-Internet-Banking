import { Module } from '@nestjs/common';
import { MailerCustomService } from './mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { CustomerModule } from '@/modules/customer/customer.module';
import { AccountModule } from '@/modules/account/account.module';

@Module({
    imports: [
      MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            // ignoreTLS: true,
            // secure: false,
            auth: {
              user: configService.get<string>('MAILDEV_USER'),
              pass: configService.get<string>('MAILDEV_PASS'),
            },
            tls: {
              rejectUnauthorized: false
            }
          },
          defaults: {
            from: '"No Reply" <no-reply@internet.banking.system.bot>',
          },
          
          // preview: true,
          template: {
            dir: join(__dirname, './templates'),
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        }),
        inject: [ConfigService],
      }),
      CustomerModule,
      AccountModule
    ],
  controllers: [],
  providers: [MailerCustomService],
  exports: [MailerCustomService]
})
export class MailerCustomModule {}