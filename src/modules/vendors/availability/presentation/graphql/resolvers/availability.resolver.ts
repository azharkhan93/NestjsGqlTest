import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AvailabilityService } from '@modules/vendors/availability/application/services';
import { GqlAuthGuard, RolesGuard } from '@common/presentation/guards/index';
import { Roles, CurrentUser } from '@common/presentation/decorators/index';
import { CurrentUserPayload } from '@common/domain/interfaces';
import { UserRole } from '@common/domain/enums';
import {
  VendorAvailabilityResponse,
  VendorScheduleType,
  UpdateScheduleInput,
  CreateBreakInput,
  CreateExceptionInput,
  SaveAvailabilityInput,
  VendorBreakType,
  VendorExceptionType,
  UpdateBreakInput,
  UpdateExceptionInput,
} from '@modules/vendors/availability/presentation/graphql/types';

@Resolver()
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.PROVIDER)
export class AvailabilityResolver {
  constructor(private readonly service: AvailabilityService) {}

  @Query(() => VendorAvailabilityResponse)
  async getVendorAvailability(
    @CurrentUser() user: CurrentUserPayload,
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
  ) {
    return this.service.getAvailability(user, vendorProfileId);
  }

  @Mutation(() => VendorAvailabilityResponse)
  async updateVendorSchedule(
    @CurrentUser() user: CurrentUserPayload,
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('schedule', { type: () => [UpdateScheduleInput] })
    schedule: UpdateScheduleInput[],
  ) {
    return this.service.updateSchedule(user, vendorProfileId, schedule);
  }

  @Mutation(() => VendorScheduleType)
  async updateVendorScheduleItem(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateScheduleInput,
  ) {
    return this.service.updateScheduleItem(user, id, input);
  }

  @Mutation(() => VendorAvailabilityResponse)
  async saveFullAvailability(
    @CurrentUser() user: CurrentUserPayload,
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('input') input: SaveAvailabilityInput,
  ) {
    return this.service.saveFullAvailability(user, vendorProfileId, input);
  }

  @Mutation(() => VendorBreakType)
  async addVendorBreak(
    @CurrentUser() user: CurrentUserPayload,
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('input') input: CreateBreakInput,
  ) {
    return this.service.addBreak(user, vendorProfileId, input);
  }

  @Mutation(() => VendorBreakType)
  async updateVendorBreak(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateBreakInput,
  ) {
    return this.service.updateBreak(user, id, input);
  }

  @Mutation(() => Boolean)
  async removeVendorBreak(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.service.removeBreak(user, id);
  }

  @Mutation(() => VendorExceptionType)
  async addVendorException(
    @CurrentUser() user: CurrentUserPayload,
    @Args('vendorProfileId', { type: () => ID }) vendorProfileId: string,
    @Args('input') input: CreateExceptionInput,
  ) {
    return this.service.addException(user, vendorProfileId, input);
  }

  @Mutation(() => VendorExceptionType)
  async updateVendorException(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateExceptionInput,
  ) {
    return this.service.updateException(user, id, input);
  }

  @Mutation(() => Boolean)
  async removeVendorException(
    @CurrentUser() user: CurrentUserPayload,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.service.removeException(user, id);
  }
}
