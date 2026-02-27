import { Injectable } from '@nestjs/common';
import { IdGenerator } from '@/utils/id-generator';
import { Organisation } from '@/modules/organisation/domain/organisation';

@Injectable()
export class OrganisationFactory {
  constructor(private readonly idGenerator: IdGenerator) {}

  create(name: string, slug: string): Organisation {
    return new Organisation(this.idGenerator.randomId(), name, slug);
  }
}
