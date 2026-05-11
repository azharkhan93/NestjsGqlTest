import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AvailabilityService } from '@modules/vendors/availability/application/services';
import { 
  VendorAvailabilityResponse, 
  UpdateScheduleInput, 
  CreateBreakInput, 
  CreateExceptionInput,
  SaveAvailabilityInput,
  VendorBreakType,
  VendorExceptionType
} from '@modules/vendors/availability/presentation/graphql/types';

@Resolver()
export class AvailabilityResolver {
  constructor(private readonly service: AvailabilityService) {}

  @Query(() => VendorAvailabilityResponse)
  async getVendorAvailability(@Args('vendorProfileId', { type: () => ID }) vendorProfileId: string) {
    return this.service.getAvailability(vendorProfileId);
  }

  @Mutation(() => VendorAvailabilityResponse)
  async updateVendorSchedule(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('schedule', { type: () => [UpdateScheduleInput] }) schedule: UpdateScheduleInput[]
  ) {
    return this.service.updateSchedule(vendorProfileId, schedule);
  }

  @Mutation(() => VendorAvailabilityResponse)
  async saveFullAvailability(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('input') input: SaveAvailabilityInput
  ) {
    return this.service.saveFullAvailability(vendorProfileId, input);
  }

  @Mutation(() => VendorBreakType)
  async addVendorBreak(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('input') input: CreateBreakInput
  ) {
    return this.service.addBreak(vendorProfileId, input);
  }

  @Mutation(() => Boolean)
  async removeVendorBreak(@Args('id', { type: () => ID }) id: string) {
    return this.service.removeBreak(id);
  }

  @Mutation(() => VendorExceptionType)
  async addVendorException(
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('input') input: CreateExceptionInput
  ) {
    return this.service.addException(vendorProfileId, input);
  }

  @Mutation(() => Boolean)
  async removeVendorException(@Args('id', { type: () => ID }) id: string) {
    return this.service.removeException(id);
  }
}
