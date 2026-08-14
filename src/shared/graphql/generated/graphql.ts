import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  JSON: { input: Record<string, unknown>; output: Record<string, unknown>; }
};

export type ActorActivityBucket = {
  __typename?: 'ActorActivityBucket';
  count: Scalars['Int']['output'];
  label: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export enum ActorActivityPeriod {
  Last_7Days = 'LAST_7_DAYS',
  Last_24Hours = 'LAST_24_HOURS'
}

export type ActorActivityStats = {
  __typename?: 'ActorActivityStats';
  actorId: Scalars['String']['output'];
  buckets: Array<ActorActivityBucket>;
  period: ActorActivityPeriod;
  total: Scalars['Int']['output'];
};

export type Address = {
  __typename?: 'Address';
  addressLine1: Scalars['String']['output'];
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  ownerType: AddressOwnerType;
  state: Scalars['String']['output'];
};

export enum AddressOwnerType {
  Organization = 'ORGANIZATION',
  Patient = 'PATIENT',
  Staff = 'STAFF'
}

export enum AdjustmentAppliedOn {
  Charge = 'CHARGE',
  Invoice = 'INVOICE',
  MultipleCharges = 'MULTIPLE_CHARGES'
}

export enum AdjustmentDirection {
  Decrease = 'DECREASE',
  Increase = 'INCREASE'
}

export enum AdjustmentMethod {
  Flat = 'FLAT',
  Percentage = 'PERCENTAGE'
}

export enum AdjustmentStatus {
  Applied = 'APPLIED',
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Requested = 'REQUESTED',
  Unrequested = 'UNREQUESTED'
}

export enum AdjustmentType {
  AdjustmentReversal = 'ADJUSTMENT_REVERSAL',
  Correction = 'CORRECTION',
  Discount = 'DISCOUNT',
  Insurance = 'INSURANCE',
  Surcharge = 'SURCHARGE',
  Waiver = 'WAIVER',
  WriteOff = 'WRITE_OFF'
}

export type AssignProcedureStaffInput = {
  functionInProcedure: StaffFunction;
  staffId: Scalars['ID']['input'];
};

export enum AuditDateFilter {
  Custom = 'CUSTOM',
  ThisMonth = 'THIS_MONTH',
  ThisWeek = 'THIS_WEEK',
  Today = 'TODAY'
}

export enum AuditDistinctField {
  Action = 'ACTION',
  ActorId = 'ACTOR_ID',
  Entity = 'ENTITY'
}

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  actorDescription?: Maybe<Scalars['String']['output']>;
  actorId?: Maybe<Scalars['String']['output']>;
  actorType?: Maybe<Scalars['String']['output']>;
  appName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  entity: Scalars['String']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  organizationId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AuditPaginationInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  actorId?: InputMaybe<Scalars['String']['input']>;
  dateFilter?: InputMaybe<AuditDateFilter>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  entity?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Float']['input'];
  page: Scalars['Float']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AuditPaginationResult = {
  __typename?: 'AuditPaginationResult';
  items: Array<AuditLog>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
};

export type AvailableTheatrePaginationInput = {
  department?: InputMaybe<TheatreDepartment>;
  endTime: Scalars['DateTime']['input'];
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  priority?: InputMaybe<TheatreBookingPriority>;
  startTime: Scalars['DateTime']['input'];
};

export type Bed = {
  __typename?: 'Bed';
  bedCode: Scalars['String']['output'];
  class: BedClass;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  status: BedStatus;
  wardId: Scalars['ID']['output'];
};

/** Classification of bed for billing and accommodation */
export enum BedClass {
  Isolation = 'ISOLATION',
  Premium = 'PREMIUM',
  Standard = 'STANDARD',
  Vip = 'VIP'
}

export type BedPaginationInput = {
  class?: InputMaybe<BedClass>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  status?: InputMaybe<BedStatus>;
  wardId: Scalars['ID']['input'];
};

export type BedPaginationResult = {
  __typename?: 'BedPaginationResult';
  items: Array<Bed>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Current structural status of a bed */
export enum BedStatus {
  Available = 'AVAILABLE',
  Blocked = 'BLOCKED',
  Cleaning = 'CLEANING',
  Decommissioned = 'DECOMMISSIONED',
  Isolation = 'ISOLATION',
  Maintenance = 'MAINTENANCE',
  Occupied = 'OCCUPIED',
  Reserved = 'RESERVED'
}

export type BillingAdjustment = {
  __typename?: 'BillingAdjustment';
  amount?: Maybe<Scalars['Float']['output']>;
  appliedAt?: Maybe<Scalars['DateTime']['output']>;
  appliedOn: AdjustmentAppliedOn;
  approvedByStaffId?: Maybe<Scalars['ID']['output']>;
  chargeLinks?: Maybe<Array<BillingAdjustmentCharge>>;
  currency: Scalars['String']['output'];
  direction?: Maybe<AdjustmentDirection>;
  id: Scalars['ID']['output'];
  invoiceId?: Maybe<Scalars['ID']['output']>;
  method: AdjustmentMethod;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  requestedByStaffId: Scalars['ID']['output'];
  reversesAdjustment?: Maybe<BillingAdjustment>;
  reversesAdjustmentId?: Maybe<Scalars['ID']['output']>;
  status: AdjustmentStatus;
  type: AdjustmentType;
  value?: Maybe<Scalars['Float']['output']>;
  visitChargeId?: Maybe<Scalars['ID']['output']>;
  visitId: Scalars['ID']['output'];
};

export type BillingAdjustmentCharge = {
  __typename?: 'BillingAdjustmentCharge';
  billingAdjustmentId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  visitCharge: VisitCharge;
  visitChargeId: Scalars['ID']['output'];
};

export type BillingCatalogueCategory = {
  __typename?: 'BillingCatalogueCategory';
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items?: Maybe<Array<GlobalBillingCatalogueItem>>;
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['ID']['output']>;
};

/** Billing calculation type */
export enum BillingType {
  Fixed = 'FIXED',
  Manual = 'MANUAL',
  PerDay = 'PER_DAY',
  PerUnit = 'PER_UNIT'
}

/** Blood group of the patient */
export enum BloodGroup {
  AbNeg = 'AB_NEG',
  AbPos = 'AB_POS',
  ANeg = 'A_NEG',
  APos = 'A_POS',
  BNeg = 'B_NEG',
  BPos = 'B_POS',
  ONeg = 'O_NEG',
  OPos = 'O_POS'
}

export type BulkAssignProcedureStaffInput = {
  assignments: Array<AssignProcedureStaffInput>;
  procedureId: Scalars['ID']['input'];
};

export type CancelTheatreBookingInput = {
  cancellationReason: Scalars['String']['input'];
  theatreBookingId: Scalars['ID']['input'];
};

export type ChargeCatalog = {
  __typename?: 'ChargeCatalog';
  billingType: BillingType;
  catalogueItem: GlobalBillingCatalogueItem;
  catalogueItemId: Scalars['ID']['output'];
  category: BillingCatalogueCategory;
  categoryId: Scalars['ID']['output'];
  code: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['ID']['output'];
  unitPrice: Scalars['Float']['output'];
};

export type ChargeCatalogPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

export type ChargeCatalogPaginationResult = {
  __typename?: 'ChargeCatalogPaginationResult';
  items: Array<ChargeCatalog>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum ChargeDomain {
  Administrative = 'ADMINISTRATIVE',
  Admission = 'ADMISSION',
  Bed = 'BED',
  Consultation = 'CONSULTATION',
  Consumable = 'CONSUMABLE',
  Dental = 'DENTAL',
  Diagnosis = 'DIAGNOSIS',
  Emergency = 'EMERGENCY',
  Equipment = 'EQUIPMENT',
  Icu = 'ICU',
  Lab = 'LAB',
  Maternity = 'MATERNITY',
  MentalHealth = 'MENTAL_HEALTH',
  Nursing = 'NURSING',
  Other = 'OTHER',
  Pharmacy = 'PHARMACY',
  Physiotherapy = 'PHYSIOTHERAPY',
  Procedure = 'PROCEDURE',
  ProcedureSupport = 'PROCEDURE_SUPPORT',
  Radiology = 'RADIOLOGY',
  Registration = 'REGISTRATION',
  Surgery = 'SURGERY',
  Vitals = 'VITALS'
}

export type ChargeDomainCatalogMapping = {
  __typename?: 'ChargeDomainCatalogMapping';
  chargeCatalog: ChargeCatalog;
  chargeCatalogId: Scalars['ID']['output'];
  chargeDomain: ChargeDomain;
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
};

export type CompleteTheatreProcedureInput = {
  actualEndTime?: InputMaybe<Scalars['DateTime']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  theatreBookingId: Scalars['ID']['input'];
};

export type CreateAddressInput = {
  addressLine1: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type CreateBedInput = {
  class: BedClass;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  status?: InputMaybe<BedStatus>;
  wardId: Scalars['ID']['input'];
};

export type CreateBillingAdjustmentInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  appliedOn: AdjustmentAppliedOn;
  direction?: InputMaybe<AdjustmentDirection>;
  invoiceId?: InputMaybe<Scalars['ID']['input']>;
  method: AdjustmentMethod;
  notes?: InputMaybe<Scalars['String']['input']>;
  reason: Scalars['String']['input'];
  reversesAdjustmentId?: InputMaybe<Scalars['ID']['input']>;
  type: AdjustmentType;
  value?: InputMaybe<Scalars['Float']['input']>;
  visitChargeId?: InputMaybe<Scalars['ID']['input']>;
  visitChargeIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  visitId: Scalars['ID']['input'];
};

export type CreateBillingCategoryInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateBillingItemInput = {
  categoryId: Scalars['ID']['input'];
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateChargeCatalogInput = {
  billingType: BillingType;
  catalogueItemId: Scalars['ID']['input'];
  categoryId: Scalars['ID']['input'];
  code: Scalars['String']['input'];
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  unitPrice: Scalars['Float']['input'];
};

export type CreateLabRequestInput = {
  chargeCatalogIds: Array<Scalars['ID']['input']>;
  confirmDuplicate?: InputMaybe<Scalars['Boolean']['input']>;
  duplicateReason?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<LabPriority>;
  visitId: Scalars['ID']['input'];
};

export type CreateLabRequestResponse = {
  __typename?: 'CreateLabRequestResponse';
  duplicates?: Maybe<Array<DuplicateWarning>>;
  labRequest?: Maybe<LabRequest>;
  previousRequests?: Maybe<Array<DuplicateWarning>>;
  requiresConfirmation?: Maybe<Scalars['Boolean']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CreateLabResultInput = {
  chargeCatalogId: Scalars['ID']['input'];
  items: Array<CreateLabResultItemInput>;
  labRequestId: Scalars['ID']['input'];
  testName: Scalars['String']['input'];
};

export type CreateLabResultItemInput = {
  interpretation?: InputMaybe<Scalars['String']['input']>;
  parameter: Scalars['String']['input'];
  referenceRange?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
};

export type CreateOrganizationInput = {
  address?: InputMaybe<CreateAddressInput>;
  code?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrganizationStatus>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePatientInput = {
  addresses?: InputMaybe<Array<CreateAddressInput>>;
  allergies?: InputMaybe<Array<Scalars['String']['input']>>;
  bloodGroup?: InputMaybe<BloodGroup>;
  dateOfBirth?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  emergency: Scalars['Boolean']['input'];
  extraDetails?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  gender: Scalars['String']['input'];
  nextOfKinName?: InputMaybe<Scalars['String']['input']>;
  nextOfKinPhone?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  secondaryPhoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePatientResult = {
  __typename?: 'CreatePatientResult';
  matches?: Maybe<Array<DuplicatePatientMatch>>;
  patient: Patient;
  warning?: Maybe<Scalars['String']['output']>;
};

export type CreateStaffInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  roles: Array<StaffRole>;
};

export type CreateTheatreBlockInput = {
  endTime: Scalars['DateTime']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  startTime: Scalars['DateTime']['input'];
  theatreId: Scalars['ID']['input'];
  type: TheatreBlockType;
};

export type CreateTheatreBookingInput = {
  estimatedDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<TheatreBookingPriority>;
  procedureId: Scalars['ID']['input'];
  scheduledEndTime: Scalars['DateTime']['input'];
  scheduledStartTime: Scalars['DateTime']['input'];
  theatreId: Scalars['ID']['input'];
};

export type CreateTheatreIncidentInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  severity: TheatreIncidentSeverity;
  theatreId: Scalars['ID']['input'];
  type: TheatreIncidentType;
};

export type CreateTheatreInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<TheatreDepartment>;
  floor?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type CreateVisitBalancePaymentInput = {
  amountPaid: Scalars['Float']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentMethod: PaymentMethod;
  reason: Scalars['String']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitBedAllocationInput = {
  bedId: Scalars['ID']['input'];
  chargeCatalogId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<VisitBedAllocationStatus>;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitChargeInput = {
  billingType?: InputMaybe<BillingType>;
  chargeCatalogId?: InputMaybe<Scalars['ID']['input']>;
  chargeDomain?: InputMaybe<ChargeDomain>;
  chargeName?: InputMaybe<Scalars['String']['input']>;
  chargeType: VisitChargeType;
  description?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  overrideReason?: InputMaybe<Scalars['String']['input']>;
  quantity?: Scalars['Int']['input'];
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitComplaintInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  complaint: Scalars['String']['input'];
  visitId: Scalars['ID']['input'];
};

export type CreateVisitCreditInput = {
  amount: Scalars['Float']['input'];
  method: CreditResolutionMethod;
  notes?: InputMaybe<Scalars['String']['input']>;
  reason: Scalars['String']['input'];
  visitChargeId?: InputMaybe<Scalars['ID']['input']>;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitDiagnosisInput = {
  chargeCatalogId?: InputMaybe<Scalars['ID']['input']>;
  diagnosis: Scalars['String']['input'];
  diagnosisCode?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitInput = {
  patientId: Scalars['ID']['input'];
  visitType: VisitType;
};

export type CreateVisitNoteInput = {
  note: Scalars['String']['input'];
  visitId: Scalars['ID']['input'];
};

export type CreateVisitPaymentInput = {
  allocations: Array<PaymentAllocationInput>;
  amountPaid: Scalars['Float']['input'];
  invoiceId?: InputMaybe<Scalars['ID']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentMethod: PaymentMethod;
  reference?: InputMaybe<Scalars['String']['input']>;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitPrescriptionInput = {
  dose?: InputMaybe<Scalars['String']['input']>;
  drug: Scalars['String']['input'];
  endDate?: InputMaybe<Scalars['String']['input']>;
  frequency?: InputMaybe<Scalars['String']['input']>;
  isProvidedInHouse?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  route?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitProcedureEventInput = {
  message: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['String']['input']>;
  occurredAt?: InputMaybe<Scalars['DateTime']['input']>;
  procedureId: Scalars['ID']['input'];
  type: Scalars['String']['input'];
};

export type CreateVisitProcedureInput = {
  _validation?: InputMaybe<Scalars['Boolean']['input']>;
  bedAllocationId?: InputMaybe<Scalars['ID']['input']>;
  customProcedureCode?: InputMaybe<Scalars['String']['input']>;
  customProcedureName?: InputMaybe<Scalars['String']['input']>;
  estimatedDuration?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  performedByStaffId?: InputMaybe<Scalars['ID']['input']>;
  priority?: InputMaybe<VisitProcedurePriority>;
  procedureCatalogId?: InputMaybe<Scalars['ID']['input']>;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitProcedureResponse = {
  __typename?: 'CreateVisitProcedureResponse';
  procedure?: Maybe<VisitProcedure>;
  success: Scalars['Boolean']['output'];
};

export type CreateVisitTaskInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueAt?: InputMaybe<Scalars['String']['input']>;
  taskType: VisitTaskType;
  visitId: Scalars['ID']['input'];
};

export type CreateVisitVitalInput = {
  bloodPressure?: InputMaybe<Scalars['String']['input']>;
  chargeCatalogId?: InputMaybe<Scalars['ID']['input']>;
  heartRate?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  respiratoryRate?: InputMaybe<Scalars['Int']['input']>;
  spo2?: InputMaybe<Scalars['Int']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
  visitId: Scalars['ID']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateWalletTopUpInput = {
  amount: Scalars['Float']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  patientId: Scalars['ID']['input'];
  paymentMethod: PaymentMethod;
  reason: Scalars['String']['input'];
};

export type CreateWardIncidentInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  severity: WardIncidentSeverity;
  type: WardIncidentType;
  wardId: Scalars['ID']['input'];
};

export type CreateWardInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<WardDepartment>;
  floor?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  wardClass: WardClass;
};

export enum CreditRefundStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Success = 'SUCCESS'
}

export enum CreditResolutionMethod {
  Card = 'CARD',
  Cash = 'CASH',
  Insurance = 'INSURANCE',
  PatientWallet = 'PATIENT_WALLET',
  Pos = 'POS',
  Transfer = 'TRANSFER'
}

export type DelayTheatreBookingInput = {
  delayReason: Scalars['String']['input'];
  newScheduledEndTime?: InputMaybe<Scalars['DateTime']['input']>;
  newScheduledStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  theatreBookingId: Scalars['ID']['input'];
};

export type DuplicatePatientMatch = {
  __typename?: 'DuplicatePatientMatch';
  confidence: Scalars['Float']['output'];
  fullName: Scalars['String']['output'];
  patientId: Scalars['String']['output'];
  patientNumber: Scalars['String']['output'];
};

export type DuplicateWarning = {
  __typename?: 'DuplicateWarning';
  chargeCatalogId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
};

/** Known feature flag keys that can be toggled on or off per organization */
export enum FeatureFlagKey {
  PatientWallet = 'PATIENT_WALLET'
}

export type FeatureFlagState = {
  __typename?: 'FeatureFlagState';
  enabled: Scalars['Boolean']['output'];
  flagKey: FeatureFlagKey;
};

export type GlobalBillingCatalogueItem = {
  __typename?: 'GlobalBillingCatalogueItem';
  category?: Maybe<BillingCatalogueCategory>;
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['ID']['output']>;
};

/** Priority of the lab request */
export enum LabPriority {
  Routine = 'ROUTINE',
  Stat = 'STAT',
  Urgent = 'URGENT'
}

export type LabRequest = {
  __typename?: 'LabRequest';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  priority: LabPriority;
  requestedByStaffId: Scalars['ID']['output'];
  status: LabRequestStatus;
  tests: Array<LabRequestTest>;
  updatedAt: Scalars['DateTime']['output'];
  visit: Visit;
  visitId: Scalars['ID']['output'];
};

export type LabRequestPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  priority?: InputMaybe<LabPriority>;
  status?: InputMaybe<LabRequestStatus>;
};

export type LabRequestPaginationResult = {
  __typename?: 'LabRequestPaginationResult';
  items: Array<LabRequest>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Current status of the lab request */
export enum LabRequestStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type LabRequestTest = {
  __typename?: 'LabRequestTest';
  chargeCatalogId: Scalars['ID']['output'];
  testName: Scalars['String']['output'];
};

export type LabResult = {
  __typename?: 'LabResult';
  chargeCatalogId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  items?: Maybe<Array<LabResultItem>>;
  labRequestId: Scalars['ID']['output'];
  performedByStaffId: Scalars['ID']['output'];
  testName: Scalars['String']['output'];
};

export type LabResultItem = {
  __typename?: 'LabResultItem';
  id: Scalars['ID']['output'];
  interpretation?: Maybe<Scalars['String']['output']>;
  parameter: Scalars['String']['output'];
  referenceRange?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type LoginAuthResponse = {
  __typename?: 'LoginAuthResponse';
  accessToken: Scalars['String']['output'];
  forcePasswordChange: Scalars['Boolean']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  abortTheatreBooking: TheatreBooking;
  applyBillingAdjustment: BillingAdjustment;
  approveBillingAdjustment: BillingAdjustment;
  approveWalletGrant: PatientWalletTransaction;
  bulkAssignVisitProcedureStaff: Array<ProcedureStaffResult>;
  cancelTheatreBooking: TheatreBooking;
  cancelVisitProcedure: VisitProcedure;
  changeStaffPassword: AuthResponse;
  cloneGlobalCategoryToOrganization: BillingCatalogueCategory;
  closeVisit: Visit;
  closeVisitWithValidation: Visit;
  completeLabRequest: LabRequest;
  completeTheatreProcedure: TheatreBooking;
  confirmVisitBalancePayment: VisitBalancePayment;
  confirmVisitCreditRefund: VisitCredit;
  confirmVisitPayment: VisitPayment;
  confirmWalletTopUp: PatientWalletTransaction;
  createBed: Bed;
  createBedAllocation: VisitBedAllocation;
  createBillingCategory: BillingCatalogueCategory;
  createBillingItem: GlobalBillingCatalogueItem;
  createChargeCatalog: ChargeCatalog;
  createChargeFromPrescription: VisitCharge;
  createLabRequest: CreateLabRequestResponse;
  createLabResult: LabResult;
  createOrganization: Organization;
  createPatient: CreatePatientResult;
  createStaff: Staff;
  createTheatre: Theatre;
  createTheatreBlock: TheatreBlock;
  createTheatreBooking: TheatreBooking;
  createTheatreIncident: TheatreIncident;
  createVisit: VisitCreationResult;
  createVisitBalancePayment: VisitBalancePayment;
  createVisitCharge: VisitCharge;
  createVisitComplaint: VisitComplaint;
  createVisitCreditRefund: VisitCredit;
  createVisitDiagnosis: VisitDiagnosis;
  createVisitNote: VisitNote;
  createVisitPayment: VisitPayment;
  createVisitPrescription: VisitPrescription;
  createVisitProcedure: CreateVisitProcedureResponse;
  createVisitProcedureEvent: VisitProcedureEvent;
  createVisitTask: VisitTask;
  createVisitVital: VisitVital;
  createWalletTopUp: PatientWalletTransaction;
  createWard: Ward;
  createWardIncident: WardIncident;
  delayTheatreBooking: TheatreBooking;
  failVisitBalancePayment: VisitBalancePayment;
  failVisitCreditRefund: VisitCredit;
  failVisitPayment: VisitPayment;
  failWalletTopUp: PatientWalletTransaction;
  generateVisitInvoice: VisitInvoice;
  issueVisitInvoice: VisitInvoice;
  logout: Scalars['Boolean']['output'];
  reallocateTheatreBooking: TheatreBooking;
  reconcileVisit: Visit;
  refreshToken: AuthResponse;
  refundVisitBalancePayment: VisitBalancePayment;
  refundVisitPayment: VisitPayment;
  rejectBillingAdjustment: BillingAdjustment;
  rejectWalletGrant: PatientWalletTransaction;
  reopenVisit: Visit;
  requestBillingAdjustment: BillingAdjustment;
  requestPasswordReset: Scalars['Boolean']['output'];
  requestWalletGrant: PatientWalletTransaction;
  resetPassword: Scalars['Boolean']['output'];
  resolveTheatreBlock: TheatreBlock;
  setOrganizationFeatureFlag: OrganizationFeatureFlagEvent;
  staffLogin: LoginAuthResponse;
  startLabRequest: LabRequest;
  startTheatreProcedure: TheatreBooking;
  syncChargeDomainMapping: Array<ChargeDomainCatalogMapping>;
  syncTheatreAvailability: Array<TheatreAvailability>;
  transferBedAllocation: VisitBedAllocation;
  updateBed: Bed;
  updateBedAllocationStatus: VisitBedAllocation;
  updateBillingCategory: BillingCatalogueCategory;
  updateChargeCatalog: ChargeCatalog;
  updateLabRequest: CreateLabRequestResponse;
  updateLabResult: LabResult;
  updateOrganizationStatus: Organization;
  updatePatient: Patient;
  updatePatientStatus: Patient;
  updateStaff: Staff;
  updateStaffPassword: Scalars['Boolean']['output'];
  updateStaffRoles: Staff;
  updateStaffStatus: Staff;
  updateTheatre: Theatre;
  updateTheatreBlock: TheatreBlock;
  updateTheatreBooking: TheatreBooking;
  updateTheatreIncident: TheatreIncident;
  updateVisitCharge: VisitCharge;
  updateVisitComplaint: VisitComplaint;
  updateVisitDiagnosis: VisitDiagnosis;
  updateVisitNote: VisitNote;
  updateVisitPrescription: VisitPrescription;
  updateVisitProcedure: VisitProcedure;
  updateVisitProcedureStaff: Array<ProcedureStaffResult>;
  updateVisitTask: VisitTask;
  updateVisitTaskStatus: VisitTask;
  updateVisitVital: VisitVital;
  updateWard: Ward;
  updateWardIncident: WardIncident;
  upsertVisitNotePosition: VisitNotePosition;
};


export type MutationAbortTheatreBookingArgs = {
  data: CancelTheatreBookingInput;
};


export type MutationApplyBillingAdjustmentArgs = {
  adjustmentId: Scalars['ID']['input'];
};


export type MutationApproveBillingAdjustmentArgs = {
  adjustmentId: Scalars['ID']['input'];
};


export type MutationApproveWalletGrantArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationBulkAssignVisitProcedureStaffArgs = {
  data: BulkAssignProcedureStaffInput;
};


export type MutationCancelTheatreBookingArgs = {
  data: CancelTheatreBookingInput;
};


export type MutationCancelVisitProcedureArgs = {
  cancellationReason: Scalars['String']['input'];
  procedureId: Scalars['ID']['input'];
};


export type MutationChangeStaffPasswordArgs = {
  input: UpdateStaffPasswordInput;
};


export type MutationCloneGlobalCategoryToOrganizationArgs = {
  categoryId: Scalars['String']['input'];
};


export type MutationCloseVisitArgs = {
  visitId: Scalars['String']['input'];
};


export type MutationCloseVisitWithValidationArgs = {
  visitId: Scalars['String']['input'];
};


export type MutationCompleteLabRequestArgs = {
  labRequestId: Scalars['ID']['input'];
};


export type MutationCompleteTheatreProcedureArgs = {
  data: CompleteTheatreProcedureInput;
};


export type MutationConfirmVisitBalancePaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationConfirmVisitCreditRefundArgs = {
  creditId: Scalars['ID']['input'];
};


export type MutationConfirmVisitPaymentArgs = {
  paymentId: Scalars['ID']['input'];
};


export type MutationConfirmWalletTopUpArgs = {
  transactionId: Scalars['ID']['input'];
};


export type MutationCreateBedArgs = {
  data: CreateBedInput;
};


export type MutationCreateBedAllocationArgs = {
  data: CreateVisitBedAllocationInput;
};


export type MutationCreateBillingCategoryArgs = {
  data: CreateBillingCategoryInput;
};


export type MutationCreateBillingItemArgs = {
  data: CreateBillingItemInput;
};


export type MutationCreateChargeCatalogArgs = {
  data: CreateChargeCatalogInput;
};


export type MutationCreateChargeFromPrescriptionArgs = {
  prescriptionId: Scalars['ID']['input'];
  unitPrice: Scalars['Float']['input'];
};


export type MutationCreateLabRequestArgs = {
  data: CreateLabRequestInput;
};


export type MutationCreateLabResultArgs = {
  data: CreateLabResultInput;
};


export type MutationCreateOrganizationArgs = {
  data: CreateOrganizationInput;
};


export type MutationCreatePatientArgs = {
  data: CreatePatientInput;
};


export type MutationCreateStaffArgs = {
  data: CreateStaffInput;
};


export type MutationCreateTheatreArgs = {
  data: CreateTheatreInput;
};


export type MutationCreateTheatreBlockArgs = {
  data: CreateTheatreBlockInput;
};


export type MutationCreateTheatreBookingArgs = {
  data: CreateTheatreBookingInput;
};


export type MutationCreateTheatreIncidentArgs = {
  data: CreateTheatreIncidentInput;
};


export type MutationCreateVisitArgs = {
  data: CreateVisitInput;
};


export type MutationCreateVisitBalancePaymentArgs = {
  data: CreateVisitBalancePaymentInput;
};


export type MutationCreateVisitChargeArgs = {
  data: CreateVisitChargeInput;
};


export type MutationCreateVisitComplaintArgs = {
  data: CreateVisitComplaintInput;
};


export type MutationCreateVisitCreditRefundArgs = {
  data: CreateVisitCreditInput;
};


export type MutationCreateVisitDiagnosisArgs = {
  data: CreateVisitDiagnosisInput;
};


export type MutationCreateVisitNoteArgs = {
  data: CreateVisitNoteInput;
};


export type MutationCreateVisitPaymentArgs = {
  data: CreateVisitPaymentInput;
};


export type MutationCreateVisitPrescriptionArgs = {
  data: CreateVisitPrescriptionInput;
};


export type MutationCreateVisitProcedureArgs = {
  data: CreateVisitProcedureInput;
};


export type MutationCreateVisitProcedureEventArgs = {
  data: CreateVisitProcedureEventInput;
};


export type MutationCreateVisitTaskArgs = {
  data: CreateVisitTaskInput;
};


export type MutationCreateVisitVitalArgs = {
  data: CreateVisitVitalInput;
};


export type MutationCreateWalletTopUpArgs = {
  data: CreateWalletTopUpInput;
};


export type MutationCreateWardArgs = {
  data: CreateWardInput;
};


export type MutationCreateWardIncidentArgs = {
  data: CreateWardIncidentInput;
};


export type MutationDelayTheatreBookingArgs = {
  data: DelayTheatreBookingInput;
};


export type MutationFailVisitBalancePaymentArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationFailVisitCreditRefundArgs = {
  creditId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationFailVisitPaymentArgs = {
  paymentId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationFailWalletTopUpArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationGenerateVisitInvoiceArgs = {
  visitId: Scalars['ID']['input'];
};


export type MutationIssueVisitInvoiceArgs = {
  invoiceId: Scalars['ID']['input'];
};


export type MutationReallocateTheatreBookingArgs = {
  data: ReallocateTheatreBookingInput;
};


export type MutationReconcileVisitArgs = {
  visitId: Scalars['String']['input'];
};


export type MutationRefundVisitBalancePaymentArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRefundVisitPaymentArgs = {
  paymentId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRejectBillingAdjustmentArgs = {
  adjustmentId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRejectWalletGrantArgs = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};


export type MutationReopenVisitArgs = {
  visitId: Scalars['String']['input'];
};


export type MutationRequestBillingAdjustmentArgs = {
  data: CreateBillingAdjustmentInput;
};


export type MutationRequestPasswordResetArgs = {
  input: RequestPasswordResetInput;
};


export type MutationRequestWalletGrantArgs = {
  data: RequestWalletGrantInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationResolveTheatreBlockArgs = {
  data: ResolveTheatreBlockInput;
};


export type MutationSetOrganizationFeatureFlagArgs = {
  enabled: Scalars['Boolean']['input'];
  flagKey: FeatureFlagKey;
  reason: Scalars['String']['input'];
};


export type MutationStaffLoginArgs = {
  input: StaffLoginInput;
};


export type MutationStartLabRequestArgs = {
  labRequestId: Scalars['ID']['input'];
};


export type MutationStartTheatreProcedureArgs = {
  data: StartTheatreProcedureInput;
};


export type MutationSyncChargeDomainMappingArgs = {
  data: SyncChargeDomainMappingInput;
};


export type MutationSyncTheatreAvailabilityArgs = {
  data: SyncTheatreAvailabilityInput;
};


export type MutationTransferBedAllocationArgs = {
  data: TransferVisitBedAllocationInput;
};


export type MutationUpdateBedArgs = {
  data: UpdateBedInput;
};


export type MutationUpdateBedAllocationStatusArgs = {
  data: UpdateVisitBedAllocationStatusInput;
};


export type MutationUpdateBillingCategoryArgs = {
  data: UpdateBillingCategoryInput;
};


export type MutationUpdateChargeCatalogArgs = {
  data: UpdateChargeCatalogInput;
};


export type MutationUpdateLabRequestArgs = {
  data: UpdateLabRequestInput;
};


export type MutationUpdateLabResultArgs = {
  data: UpdateLabResultInput;
};


export type MutationUpdateOrganizationStatusArgs = {
  id: Scalars['String']['input'];
  status: OrganizationStatus;
};


export type MutationUpdatePatientArgs = {
  data: UpdatePatientInput;
};


export type MutationUpdatePatientStatusArgs = {
  data: UpdatePatientStatusInput;
};


export type MutationUpdateStaffArgs = {
  data: UpdateStaffInput;
};


export type MutationUpdateStaffPasswordArgs = {
  input: UpdateStaffPasswordInput;
};


export type MutationUpdateStaffRolesArgs = {
  data: UpdateStaffRolesInput;
};


export type MutationUpdateStaffStatusArgs = {
  data: UpdateStaffStatusInput;
};


export type MutationUpdateTheatreArgs = {
  data: UpdateTheatreInput;
};


export type MutationUpdateTheatreBlockArgs = {
  data: UpdateTheatreBlockInput;
};


export type MutationUpdateTheatreBookingArgs = {
  data: UpdateTheatreBookingInput;
};


export type MutationUpdateTheatreIncidentArgs = {
  data: UpdateTheatreIncidentInput;
};


export type MutationUpdateVisitChargeArgs = {
  data: UpdateVisitChargeInput;
};


export type MutationUpdateVisitComplaintArgs = {
  data: UpdateVisitComplaintInput;
};


export type MutationUpdateVisitDiagnosisArgs = {
  data: UpdateVisitDiagnosisInput;
};


export type MutationUpdateVisitNoteArgs = {
  data: UpdateVisitNoteInput;
};


export type MutationUpdateVisitPrescriptionArgs = {
  data: UpdateVisitPrescriptionInput;
};


export type MutationUpdateVisitProcedureArgs = {
  data: UpdateVisitProcedureInput;
};


export type MutationUpdateVisitProcedureStaffArgs = {
  data: UpdateProcedureStaffInput;
};


export type MutationUpdateVisitTaskArgs = {
  data: UpdateVisitTaskInput;
};


export type MutationUpdateVisitTaskStatusArgs = {
  data: UpdateVisitTaskStatusInput;
};


export type MutationUpdateVisitVitalArgs = {
  data: UpdateVisitVitalInput;
};


export type MutationUpdateWardArgs = {
  data: UpdateWardInput;
};


export type MutationUpdateWardIncidentArgs = {
  data: UpdateWardIncidentInput;
};


export type MutationUpsertVisitNotePositionArgs = {
  data: UpsertVisitNotePositionInput;
};

export type Organization = {
  __typename?: 'Organization';
  address?: Maybe<Address>;
  code?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationNumber: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  status: OrganizationStatus;
  website?: Maybe<Scalars['String']['output']>;
};

export type OrganizationFeatureFlagEvent = {
  __typename?: 'OrganizationFeatureFlagEvent';
  changedByStaff: Staff;
  changedByStaffId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  enabled: Scalars['Boolean']['output'];
  flagKey: FeatureFlagKey;
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Status of the organization */
export enum OrganizationStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type PaginatedStaff = {
  __typename?: 'PaginatedStaff';
  items: Array<Staff>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Patient = {
  __typename?: 'Patient';
  addresses?: Maybe<Array<Maybe<Address>>>;
  allergies?: Maybe<Array<Scalars['String']['output']>>;
  bloodGroup?: Maybe<BloodGroup>;
  createdByStaffId?: Maybe<Scalars['ID']['output']>;
  dateOfBirth?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emergency: Scalars['Boolean']['output'];
  extraDetails?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  likelyDuplicatePatientIds?: Maybe<Array<Scalars['ID']['output']>>;
  nextOfKinName?: Maybe<Scalars['String']['output']>;
  nextOfKinPhone?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  patientNumber: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  secondaryPhoneNumber?: Maybe<Scalars['String']['output']>;
  status: PatientStatus;
  userCode: Scalars['Float']['output'];
  userType: UserType;
};

export type PatientOutstandingBalanceResult = {
  __typename?: 'PatientOutstandingBalanceResult';
  patientId: Scalars['String']['output'];
  patientName: Scalars['String']['output'];
  patientUserCode?: Maybe<Scalars['Float']['output']>;
  totalChargesAcrossAllVisits: Scalars['Float']['output'];
  totalOutstandingBalance: Scalars['Float']['output'];
  totalPaidAcrossAllVisits: Scalars['Float']['output'];
  visitOutstandings: Array<VisitOutstandingBalance>;
};

export type PatientPaginationInput = {
  limit: Scalars['Float']['input'];
  page: Scalars['Float']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PatientStatus>;
};

export type PatientPaginationResult = {
  __typename?: 'PatientPaginationResult';
  items: Array<Patient>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Status of the patient */
export enum PatientStatus {
  Active = 'ACTIVE',
  Deceased = 'DECEASED',
  Discharged = 'DISCHARGED',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export type PatientWalletTransaction = {
  __typename?: 'PatientWalletTransaction';
  amount: Scalars['Float']['output'];
  approvedByStaff?: Maybe<Staff>;
  approvedByStaffId?: Maybe<Scalars['ID']['output']>;
  confirmedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  patient: Patient;
  patientId: Scalars['ID']['output'];
  paymentMethod?: Maybe<PaymentMethod>;
  reason: Scalars['String']['output'];
  requestedByStaff: Staff;
  requestedByStaffId: Scalars['ID']['output'];
  status: WalletTransactionStatus;
  type: WalletTransactionType;
  updatedAt: Scalars['DateTime']['output'];
  visit?: Maybe<Visit>;
  visitCredit?: Maybe<VisitCredit>;
  visitCreditId?: Maybe<Scalars['ID']['output']>;
  visitId?: Maybe<Scalars['ID']['output']>;
};

export type PatientWalletTransactionPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  status?: InputMaybe<WalletTransactionStatus>;
  type?: InputMaybe<WalletTransactionType>;
};

export type PatientWalletTransactionPaginationResult = {
  __typename?: 'PatientWalletTransactionPaginationResult';
  items: Array<PatientWalletTransaction>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaymentAllocationInput = {
  amountAllocated: Scalars['Float']['input'];
  visitChargeId: Scalars['ID']['input'];
};

export enum PaymentMethod {
  Card = 'CARD',
  Cash = 'CASH',
  Insurance = 'INSURANCE',
  Pos = 'POS',
  Transfer = 'TRANSFER',
  Wallet = 'WALLET'
}

export enum PaymentStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  Success = 'SUCCESS'
}

export type ProcedureStaffResult = {
  __typename?: 'ProcedureStaffResult';
  functionInProcedure: StaffFunction;
  id: Scalars['ID']['output'];
  staffId: Scalars['ID']['output'];
  staffName: Scalars['String']['output'];
  userCode?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  activeBlocksForTheatre: Array<TheatreBlock>;
  auditLogs: AuditPaginationResult;
  availableTheatresForTimeRange: TheatrePaginationResult;
  bedAllocationById: VisitBedAllocation;
  bedAllocationsByVisit: Array<VisitBedAllocation>;
  beds: BedPaginationResult;
  billingAdjustments: Array<BillingAdjustment>;
  billingCategoryById: BillingCatalogueCategory;
  canReconcileVisit: VisitReconcileResult;
  catalogsByChargeDomain: Array<ChargeDomainCatalogMapping>;
  chargeDomainMappings: Array<ChargeDomainCatalogMapping>;
  getActorActivityStats: ActorActivityStats;
  getAuditDistinctValues: Array<Scalars['String']['output']>;
  getAuditLogById: AuditLog;
  getAuditLogs: Array<AuditLog>;
  getProcedureTheatreBookings: Array<TheatreBooking>;
  globalBillingCategories: Array<BillingCatalogueCategory>;
  health: Scalars['String']['output'];
  labRequestById: LabRequest;
  labRequests: LabRequestPaginationResult;
  labRequestsByVisit: Array<LabRequest>;
  labResultsByLabRequest: Array<LabResult>;
  latestVisitInvoice?: Maybe<VisitInvoice>;
  organization: Organization;
  organizationBillingCategories: Array<BillingCatalogueCategory>;
  organizationChargeCatalogs: ChargeCatalogPaginationResult;
  organizationChargeItems: Array<GlobalBillingCatalogueItem>;
  organizationFeatureFlagHistory: Array<OrganizationFeatureFlagEvent>;
  organizationFeatureFlags: Array<FeatureFlagState>;
  organizations: Array<Organization>;
  patientById: Patient;
  patientOutstandingBalance: PatientOutstandingBalanceResult;
  patientVisitHistory: Array<Visit>;
  patientWalletBalance: Scalars['Float']['output'];
  patientWalletTransactions: Array<PatientWalletTransaction>;
  patientWalletTransactionsPaginated: PatientWalletTransactionPaginationResult;
  patients: PatientPaginationResult;
  staffById: Staff;
  staffByRole: Array<Staff>;
  staffs: PaginatedStaff;
  theatreAvailabilities: Array<TheatreAvailability>;
  theatreById: Theatre;
  theatreIncidentById: TheatreIncident;
  theatreIncidents: TheatreIncidentPaginationResult;
  theatreIncidentsByTheatre: TheatreIncidentPaginationResult;
  theatreScheduleForDay: TheatreScheduleForDay;
  theatres: TheatrePaginationResult;
  unbilledPrescriptions: Array<VisitPrescription>;
  validatePasswordResetToken: Scalars['Boolean']['output'];
  visit: Visit;
  visitBalancePayments: Array<VisitBalancePayment>;
  visitBedAllocationsByWard: Array<VisitBedAllocation>;
  visitChargeBalances: Array<VisitChargeBalance>;
  visitChargeExistsByDomain: Scalars['Boolean']['output'];
  visitChargeSummary: VisitChargeSummary;
  visitChargeTotal: Scalars['Float']['output'];
  visitClosureValidation: VisitClosureValidationResult;
  visitComplaintById: VisitComplaint;
  visitComplaints: Array<VisitComplaint>;
  visitCreditBalance: Scalars['Float']['output'];
  visitCredits: Array<VisitCredit>;
  visitCurrentTotals: VisitCurrentTotals;
  visitDiagnoses: Array<VisitDiagnosis>;
  visitDiagnosisById: VisitDiagnosis;
  visitInvoiceDetail: VisitInvoiceDetail;
  visitInvoices: Array<VisitInvoice>;
  visitNotePositionsByVisit: Array<VisitNotePosition>;
  visitNotesByVisit: Array<VisitNote>;
  visitPayments: Array<VisitPayment>;
  visitPrescriptions: Array<VisitPrescription>;
  visitProcedureById: VisitProcedure;
  visitProcedureEvents: VisitProcedureEventPaginationResult;
  visitProcedureStaff: Array<ProcedureStaffResult>;
  visitProcedures: VisitProcedurePaginationResult;
  visitProceduresByVisit: Array<VisitProcedure>;
  visitTasksByVisit: Array<VisitTask>;
  visitVitals: Array<VisitVital>;
  visits: VisitPaginationResult;
  visitsByPatientUserCode: Array<Visit>;
  wardById: Ward;
  wardIncidentById: WardIncident;
  wardIncidents: WardIncidentPaginationResult;
  wardIncidentsByWard: WardIncidentPaginationResult;
  wards: WardPaginationResult;
  whoAmI: WhoAmIDto;
};


export type QueryActiveBlocksForTheatreArgs = {
  theatreId: Scalars['ID']['input'];
};


export type QueryAuditLogsArgs = {
  pagination: AuditPaginationInput;
};


export type QueryAvailableTheatresForTimeRangeArgs = {
  pagination: AvailableTheatrePaginationInput;
};


export type QueryBedAllocationByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBedAllocationsByVisitArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryBedsArgs = {
  pagination: BedPaginationInput;
};


export type QueryBillingAdjustmentsArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryBillingCategoryByIdArgs = {
  categoryId: Scalars['String']['input'];
};


export type QueryCanReconcileVisitArgs = {
  visitId: Scalars['String']['input'];
};


export type QueryCatalogsByChargeDomainArgs = {
  chargeDomain: ChargeDomain;
};


export type QueryGetActorActivityStatsArgs = {
  period: ActorActivityPeriod;
};


export type QueryGetAuditDistinctValuesArgs = {
  field: AuditDistinctField;
};


export type QueryGetAuditLogByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetProcedureTheatreBookingsArgs = {
  procedureId: Scalars['ID']['input'];
};


export type QueryLabRequestByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLabRequestsArgs = {
  pagination: LabRequestPaginationInput;
};


export type QueryLabRequestsByVisitArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryLabResultsByLabRequestArgs = {
  labRequestId: Scalars['ID']['input'];
};


export type QueryLatestVisitInvoiceArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryOrganizationArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrganizationChargeCatalogsArgs = {
  pagination: ChargeCatalogPaginationInput;
};


export type QueryOrganizationFeatureFlagHistoryArgs = {
  flagKey?: InputMaybe<FeatureFlagKey>;
};


export type QueryPatientByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryPatientOutstandingBalanceArgs = {
  patientId: Scalars['ID']['input'];
};


export type QueryPatientVisitHistoryArgs = {
  patientId: Scalars['String']['input'];
};


export type QueryPatientWalletBalanceArgs = {
  patientId: Scalars['ID']['input'];
};


export type QueryPatientWalletTransactionsArgs = {
  patientId: Scalars['ID']['input'];
};


export type QueryPatientWalletTransactionsPaginatedArgs = {
  pagination: PatientWalletTransactionPaginationInput;
  patientId: Scalars['ID']['input'];
};


export type QueryPatientsArgs = {
  pagination: PatientPaginationInput;
};


export type QueryStaffByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryStaffByRoleArgs = {
  role: StaffRole;
};


export type QueryStaffsArgs = {
  pagination: StaffPaginationInput;
};


export type QueryTheatreAvailabilitiesArgs = {
  theatreId: Scalars['ID']['input'];
};


export type QueryTheatreByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTheatreIncidentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTheatreIncidentsArgs = {
  pagination: TheatreIncidentPaginationInput;
};


export type QueryTheatreIncidentsByTheatreArgs = {
  pagination: TheatreIncidentPaginationInput;
  theatreId: Scalars['ID']['input'];
};


export type QueryTheatreScheduleForDayArgs = {
  date: Scalars['DateTime']['input'];
  theatreId: Scalars['ID']['input'];
};


export type QueryTheatresArgs = {
  pagination: TheatrePaginationInput;
};


export type QueryUnbilledPrescriptionsArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryValidatePasswordResetTokenArgs = {
  token: Scalars['String']['input'];
};


export type QueryVisitArgs = {
  id: Scalars['String']['input'];
};


export type QueryVisitBalancePaymentsArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitBedAllocationsByWardArgs = {
  wardId: Scalars['ID']['input'];
};


export type QueryVisitChargeBalancesArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitChargeExistsByDomainArgs = {
  chargeDomain: ChargeDomain;
  visitId: Scalars['String']['input'];
};


export type QueryVisitChargeSummaryArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitChargeTotalArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitClosureValidationArgs = {
  visitId: Scalars['String']['input'];
};


export type QueryVisitComplaintByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVisitComplaintsArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitCreditBalanceArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitCreditsArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitCurrentTotalsArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitDiagnosesArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitDiagnosisByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVisitInvoiceDetailArgs = {
  invoiceId: Scalars['ID']['input'];
};


export type QueryVisitInvoicesArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitNotePositionsByVisitArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitNotesByVisitArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitPaymentsArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitPrescriptionsArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitProcedureByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVisitProcedureEventsArgs = {
  pagination: VisitProcedureEventPaginationInput;
};


export type QueryVisitProcedureStaffArgs = {
  procedureId: Scalars['ID']['input'];
};


export type QueryVisitProceduresArgs = {
  pagination: VisitProcedurePaginationInput;
};


export type QueryVisitProceduresByVisitArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitTasksByVisitArgs = {
  visitId: Scalars['ID']['input'];
};


export type QueryVisitVitalsArgs = {
  visitId: Scalars['String']['input'];
};


export type QueryVisitsArgs = {
  pagination: VisitPaginationInput;
};


export type QueryVisitsByPatientUserCodeArgs = {
  userCode: Scalars['Int']['input'];
};


export type QueryWardByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWardIncidentByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWardIncidentsArgs = {
  pagination: WardIncidentPaginationInput;
};


export type QueryWardIncidentsByWardArgs = {
  pagination: WardIncidentPaginationInput;
  wardId: Scalars['ID']['input'];
};


export type QueryWardsArgs = {
  pagination: WardPaginationInput;
};

export type ReallocateTheatreBookingInput = {
  newTheatreId: Scalars['ID']['input'];
  reallocationReason?: InputMaybe<Scalars['String']['input']>;
  scheduledEndTime?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  theatreBookingId: Scalars['ID']['input'];
};

export type RequestPasswordResetInput = {
  email: Scalars['String']['input'];
};

export type RequestWalletGrantInput = {
  amount: Scalars['Float']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  patientId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type ResolveTheatreBlockInput = {
  resolutionReason?: InputMaybe<Scalars['String']['input']>;
  status: TheatreBlockStatus;
  theatreBlockId: Scalars['ID']['input'];
};

export type Staff = {
  __typename?: 'Staff';
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  roles: Array<StaffRole>;
  status: StaffStatus;
  userCode: Scalars['Float']['output'];
  userType: UserType;
};

/** Function of staff during a procedure */
export enum StaffFunction {
  Anesthetist = 'ANESTHETIST',
  Assistant = 'ASSISTANT',
  AssistantSurgeon = 'ASSISTANT_SURGEON',
  CirculatingNurse = 'CIRCULATING_NURSE',
  Observer = 'OBSERVER',
  PrimarySurgeon = 'PRIMARY_SURGEON',
  ScrubNurse = 'SCRUB_NURSE',
  Technician = 'TECHNICIAN'
}

export type StaffLoginInput = {
  password: Scalars['String']['input'];
  userCode: Scalars['Float']['input'];
};

export type StaffPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Roles assigned to staff members */
export enum StaffRole {
  Admin = 'ADMIN',
  BillingOfficer = 'BILLING_OFFICER',
  Doctor = 'DOCTOR',
  LabTech = 'LAB_TECH',
  Nurse = 'NURSE',
  Pharmacist = 'PHARMACIST',
  Receptionist = 'RECEPTIONIST'
}

/** Status of the staff member */
export enum StaffStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export type StartTheatreProcedureInput = {
  actualStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  theatreBookingId: Scalars['ID']['input'];
};

export type SyncChargeDomainMappingInput = {
  chargeCatalogIds: Array<Scalars['ID']['input']>;
  chargeDomain: ChargeDomain;
};

export type SyncTheatreAvailabilityInput = {
  schedules: Array<TheatreAvailabilityScheduleInput>;
  theatreId: Scalars['ID']['input'];
};

export type Theatre = {
  __typename?: 'Theatre';
  capacity?: Maybe<Scalars['Float']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  department?: Maybe<TheatreDepartment>;
  floor?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
};

export type TheatreAvailability = {
  __typename?: 'TheatreAvailability';
  createdBy: Staff;
  createdByStaffId: Scalars['ID']['output'];
  dayOfWeek: Scalars['Int']['output'];
  endTime: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  startTime: Scalars['String']['output'];
  theatre: Theatre;
  theatreId: Scalars['ID']['output'];
  type: TheatreAvailabilityType;
};

export type TheatreAvailabilityScheduleInput = {
  dayOfWeek: Scalars['Float']['input'];
  endTime: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  startTime: Scalars['String']['input'];
  type: TheatreAvailabilityType;
};

export enum TheatreAvailabilityType {
  Emergency = 'EMERGENCY',
  Regular = 'REGULAR',
  SpecialSession = 'SPECIAL_SESSION'
}

export type TheatreBlock = {
  __typename?: 'TheatreBlock';
  createdBy: Staff;
  createdByStaffId: Scalars['ID']['output'];
  endTime: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  startTime: Scalars['DateTime']['output'];
  status: TheatreBlockStatus;
  theatre: Theatre;
  theatreId: Scalars['ID']['output'];
  type: TheatreBlockType;
};

export enum TheatreBlockStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Released = 'RELEASED'
}

export enum TheatreBlockType {
  Cleaning = 'CLEANING',
  EquipmentFailure = 'EQUIPMENT_FAILURE',
  InfectionControl = 'INFECTION_CONTROL',
  Maintenance = 'MAINTENANCE',
  Other = 'OTHER',
  Reserved = 'RESERVED',
  Sterilization = 'STERILIZATION'
}

export type TheatreBooking = {
  __typename?: 'TheatreBooking';
  actualDurationMinutes?: Maybe<Scalars['Int']['output']>;
  actualEndTime?: Maybe<Scalars['DateTime']['output']>;
  actualStartTime?: Maybe<Scalars['DateTime']['output']>;
  bookedBy: Staff;
  bookedByStaffId: Scalars['ID']['output'];
  cancellationReason?: Maybe<Scalars['String']['output']>;
  delayReason?: Maybe<Scalars['String']['output']>;
  estimatedDurationMinutes?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  priority: TheatreBookingPriority;
  procedure: VisitProcedure;
  procedureId: Scalars['ID']['output'];
  scheduledEndTime: Scalars['DateTime']['output'];
  scheduledStartTime: Scalars['DateTime']['output'];
  status: TheatreBookingStatus;
  theatre: Theatre;
  theatreId: Scalars['ID']['output'];
};

export enum TheatreBookingPriority {
  Elective = 'ELECTIVE',
  Emergency = 'EMERGENCY',
  Urgent = 'URGENT'
}

export enum TheatreBookingStatus {
  Aborted = 'ABORTED',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Delayed = 'DELAYED',
  InProgress = 'IN_PROGRESS',
  PendingReallocation = 'PENDING_REALLOCATION',
  Postponed = 'POSTPONED',
  Ready = 'READY',
  Scheduled = 'SCHEDULED'
}

/** Department type for a theatre */
export enum TheatreDepartment {
  Cardiothoracic = 'CARDIOTHORACIC',
  Emergency = 'EMERGENCY',
  Ent = 'ENT',
  GeneralSurgery = 'GENERAL_SURGERY',
  Neurosurgery = 'NEUROSURGERY',
  ObstetricsGynecology = 'OBSTETRICS_GYNECOLOGY',
  Ophthalmology = 'OPHTHALMOLOGY',
  Orthopedics = 'ORTHOPEDICS',
  PediatricSurgery = 'PEDIATRIC_SURGERY',
  Urology = 'UROLOGY'
}

export type TheatreIncident = {
  __typename?: 'TheatreIncident';
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  organizationId: Scalars['String']['output'];
  reportedAt: Scalars['DateTime']['output'];
  reportedBy: Staff;
  reportedByStaffId: Scalars['String']['output'];
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  severity: TheatreIncidentSeverity;
  status: TheatreIncidentStatus;
  theatre: Theatre;
  theatreId: Scalars['String']['output'];
  type: TheatreIncidentType;
};

export type TheatreIncidentPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  severity?: InputMaybe<TheatreIncidentSeverity>;
  status?: InputMaybe<TheatreIncidentStatus>;
  theatreId?: InputMaybe<Scalars['ID']['input']>;
  type?: InputMaybe<TheatreIncidentType>;
};

export type TheatreIncidentPaginationResult = {
  __typename?: 'TheatreIncidentPaginationResult';
  items: Array<TheatreIncident>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum TheatreIncidentSeverity {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum TheatreIncidentStatus {
  Active = 'ACTIVE',
  Escalated = 'ESCALATED',
  Resolved = 'RESOLVED'
}

export enum TheatreIncidentType {
  EquipmentFailure = 'EQUIPMENT_FAILURE',
  FireOutbreak = 'FIRE_OUTBREAK',
  GasLeak = 'GAS_LEAK',
  Other = 'OTHER',
  PatientEmergency = 'PATIENT_EMERGENCY',
  PowerFailure = 'POWER_FAILURE',
  SchedulingConflict = 'SCHEDULING_CONFLICT',
  SecurityBreach = 'SECURITY_BREACH',
  StaffShortage = 'STAFF_SHORTAGE',
  SterilityBreach = 'STERILITY_BREACH',
  WaterLeak = 'WATER_LEAK'
}

export type TheatrePaginationInput = {
  department?: InputMaybe<TheatreDepartment>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type TheatrePaginationResult = {
  __typename?: 'TheatrePaginationResult';
  items: Array<Theatre>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type TheatreScheduleForDay = {
  __typename?: 'TheatreScheduleForDay';
  availability: Array<TheatreAvailability>;
  blocks: Array<TheatreBlock>;
  bookings: Array<TheatreBooking>;
  computedStatus: TheatreScheduleStatus;
  date: Scalars['DateTime']['output'];
  theatre: Theatre;
};

export enum TheatreScheduleStatus {
  Available = 'AVAILABLE',
  Blocked = 'BLOCKED',
  Partial = 'PARTIAL'
}

export type TransferVisitBedAllocationInput = {
  allocationId: Scalars['ID']['input'];
  chargeCatalogId: Scalars['ID']['input'];
  newBedId: Scalars['ID']['input'];
  newStatus?: InputMaybe<VisitBedAllocationStatus>;
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBedInput = {
  bedId: Scalars['ID']['input'];
  class?: InputMaybe<BedClass>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<BedStatus>;
};

export type UpdateBillingCategoryInput = {
  categoryId: Scalars['ID']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChargeCatalogInput = {
  billingType?: InputMaybe<BillingType>;
  chargeCatalogId: Scalars['ID']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateLabRequestInput = {
  chargeCatalogIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  confirmDuplicate?: InputMaybe<Scalars['Boolean']['input']>;
  duplicateReason?: InputMaybe<Scalars['String']['input']>;
  labRequestId: Scalars['ID']['input'];
  priority?: InputMaybe<LabPriority>;
};

export type UpdateLabResultInput = {
  items: Array<UpdateLabResultItemInput>;
  labResultId: Scalars['ID']['input'];
};

export type UpdateLabResultItemInput = {
  interpretation?: InputMaybe<Scalars['String']['input']>;
  parameter: Scalars['String']['input'];
  referenceRange?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
};

export type UpdatePatientInput = {
  addresses?: InputMaybe<Array<CreateAddressInput>>;
  allergies?: InputMaybe<Array<Scalars['String']['input']>>;
  bloodGroup?: InputMaybe<BloodGroup>;
  extraDetails?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  nextOfKinName?: InputMaybe<Scalars['String']['input']>;
  nextOfKinPhone?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePatientStatusInput = {
  id: Scalars['String']['input'];
  status: PatientStatus;
};

export type UpdateProcedureStaffInput = {
  assignments: Array<AssignProcedureStaffInput>;
  procedureId: Scalars['ID']['input'];
};

export type UpdateStaffInput = {
  fullName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStaffPasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type UpdateStaffRolesInput = {
  roles: Array<StaffRole>;
  staffId: Scalars['ID']['input'];
};

export type UpdateStaffStatusInput = {
  staffId: Scalars['String']['input'];
  status: StaffStatus;
};

export type UpdateTheatreBlockInput = {
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  theatreBlockId: Scalars['ID']['input'];
  type?: InputMaybe<TheatreBlockType>;
};

export type UpdateTheatreBookingInput = {
  estimatedDurationMinutes?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<TheatreBookingPriority>;
  scheduledEndTime?: InputMaybe<Scalars['DateTime']['input']>;
  scheduledStartTime?: InputMaybe<Scalars['DateTime']['input']>;
  theatreBookingId: Scalars['ID']['input'];
};

export type UpdateTheatreIncidentInput = {
  incidentId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  resolvedAt?: InputMaybe<Scalars['DateTime']['input']>;
  severity?: InputMaybe<TheatreIncidentSeverity>;
  status?: InputMaybe<TheatreIncidentStatus>;
  type?: InputMaybe<TheatreIncidentType>;
};

export type UpdateTheatreInput = {
  capacity?: InputMaybe<Scalars['Int']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<TheatreDepartment>;
  floor?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  theatreId: Scalars['ID']['input'];
};

export type UpdateVisitBedAllocationStatusInput = {
  allocationId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  status: VisitBedAllocationStatus;
};

export type UpdateVisitChargeInput = {
  chargeType?: InputMaybe<VisitChargeType>;
  notes?: InputMaybe<Scalars['String']['input']>;
  overrideReason?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<VisitChargeStatus>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
  visitChargeId: Scalars['ID']['input'];
};

export type UpdateVisitComplaintInput = {
  complaint: Scalars['String']['input'];
  complaintId: Scalars['ID']['input'];
};

export type UpdateVisitDiagnosisInput = {
  diagnosis: Scalars['String']['input'];
  diagnosisCode?: InputMaybe<Scalars['String']['input']>;
  diagnosisId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVisitNoteInput = {
  note: Scalars['String']['input'];
  visitNoteId: Scalars['ID']['input'];
};

export type UpdateVisitPrescriptionInput = {
  dose?: InputMaybe<Scalars['String']['input']>;
  drug?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  frequency?: InputMaybe<Scalars['String']['input']>;
  isProvidedInHouse?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  prescriptionId: Scalars['ID']['input'];
  route?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateVisitProcedureInput = {
  _validation?: InputMaybe<Scalars['Boolean']['input']>;
  bedAllocationId?: InputMaybe<Scalars['ID']['input']>;
  cancellationReason?: InputMaybe<Scalars['String']['input']>;
  cancelledAt?: InputMaybe<Scalars['DateTime']['input']>;
  completedAt?: InputMaybe<Scalars['DateTime']['input']>;
  customProcedureCode?: InputMaybe<Scalars['String']['input']>;
  customProcedureName?: InputMaybe<Scalars['String']['input']>;
  estimatedDuration?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  outcome?: InputMaybe<VisitProcedureOutcome>;
  performedByStaffId?: InputMaybe<Scalars['ID']['input']>;
  priority?: InputMaybe<VisitProcedurePriority>;
  procedureCatalogId?: InputMaybe<Scalars['ID']['input']>;
  startedAt?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<VisitProcedureStatus>;
  visitProcedureId: Scalars['ID']['input'];
};

export type UpdateVisitTaskInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueAt?: InputMaybe<Scalars['String']['input']>;
  taskType?: InputMaybe<VisitTaskType>;
  visitTaskId: Scalars['ID']['input'];
};

export type UpdateVisitTaskStatusInput = {
  status: VisitTaskStatus;
  visitTaskId: Scalars['ID']['input'];
};

export type UpdateVisitVitalInput = {
  bloodPressure?: InputMaybe<Scalars['String']['input']>;
  heartRate?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  respiratoryRate?: InputMaybe<Scalars['Int']['input']>;
  spo2?: InputMaybe<Scalars['Int']['input']>;
  temperature?: InputMaybe<Scalars['Float']['input']>;
  vitalId: Scalars['ID']['input'];
  weight?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateWardIncidentInput = {
  incidentId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  resolvedAt?: InputMaybe<Scalars['DateTime']['input']>;
  severity?: InputMaybe<WardIncidentSeverity>;
  status?: InputMaybe<WardIncidentStatus>;
  type?: InputMaybe<WardIncidentType>;
};

export type UpdateWardInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<WardDepartment>;
  floor?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  wardClass?: InputMaybe<WardClass>;
  wardId: Scalars['ID']['input'];
};

export type UpsertVisitNotePositionInput = {
  positionX: Scalars['Float']['input'];
  positionY: Scalars['Float']['input'];
  visitNoteId: Scalars['ID']['input'];
  zIndex?: InputMaybe<Scalars['Int']['input']>;
};

/** Type of user */
export enum UserType {
  Admin = 'ADMIN',
  Patient = 'PATIENT',
  Staff = 'STAFF'
}

export type Visit = {
  __typename?: 'Visit';
  attendingStaffId?: Maybe<Scalars['ID']['output']>;
  closedAt?: Maybe<Scalars['DateTime']['output']>;
  closedByStaff?: Maybe<Staff>;
  closedByStaffId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  patient: Patient;
  patientId: Scalars['ID']['output'];
  reconciledAt?: Maybe<Scalars['DateTime']['output']>;
  reconciledByStaff?: Maybe<Staff>;
  reconciledByStaffId?: Maybe<Scalars['ID']['output']>;
  status: VisitStatus;
  visitDateTime: Scalars['DateTime']['output'];
  visitType: VisitType;
};

export type VisitBalancePayment = {
  __typename?: 'VisitBalancePayment';
  amountPaid: Scalars['Float']['output'];
  confirmedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paidAt: Scalars['DateTime']['output'];
  paymentMethod: PaymentMethod;
  reason: Scalars['String']['output'];
  receivedByStaff: Staff;
  receivedByStaffId: Scalars['ID']['output'];
  reference?: Maybe<Scalars['String']['output']>;
  status: PaymentStatus;
  updatedAt: Scalars['DateTime']['output'];
  visit: Visit;
  visitId: Scalars['ID']['output'];
};

export type VisitBedAllocation = {
  __typename?: 'VisitBedAllocation';
  allocatedAt: Scalars['DateTime']['output'];
  allocatedBy: Staff;
  allocatedByStaffId: Scalars['ID']['output'];
  bed: Bed;
  bedAllocationCatalog?: Maybe<ChargeCatalog>;
  bedId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  releasedAt?: Maybe<Scalars['DateTime']['output']>;
  releasedBy?: Maybe<Staff>;
  releasedByStaffId?: Maybe<Scalars['ID']['output']>;
  status: VisitBedAllocationStatus;
  visit: Visit;
  visitCharge?: Maybe<VisitCharge>;
  visitId: Scalars['ID']['output'];
};

/** Current allocation status of a bed for a visit */
export enum VisitBedAllocationStatus {
  Occupied = 'OCCUPIED',
  Released = 'RELEASED',
  Reserved = 'RESERVED',
  Transferred = 'TRANSFERRED'
}

export type VisitCharge = {
  __typename?: 'VisitCharge';
  billingType?: Maybe<BillingType>;
  chargeCatalog?: Maybe<ChargeCatalog>;
  chargeCatalogId?: Maybe<Scalars['ID']['output']>;
  chargeDomain?: Maybe<ChargeDomain>;
  chargeName: Scalars['String']['output'];
  chargeType: VisitChargeType;
  createdBy: Staff;
  createdByStaffId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  overrideReason?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  status: VisitChargeStatus;
  totalAmount?: Maybe<Scalars['Float']['output']>;
  unitPrice: Scalars['Float']['output'];
  visit: Visit;
  visitId: Scalars['ID']['output'];
};

export type VisitChargeBalance = {
  __typename?: 'VisitChargeBalance';
  amountPaid: Scalars['Float']['output'];
  effectiveTotal: Scalars['Float']['output'];
  remaining: Scalars['Float']['output'];
  totalAmount: Scalars['Float']['output'];
  visitChargeId: Scalars['ID']['output'];
};

export enum VisitChargeStatus {
  Billed = 'BILLED',
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Waived = 'WAIVED'
}

export type VisitChargeSummary = {
  __typename?: 'VisitChargeSummary';
  editableCharges: Array<VisitCharge>;
  lockedCharges: Array<VisitCharge>;
  total: Scalars['Float']['output'];
};

export enum VisitChargeType {
  Fixed = 'FIXED',
  Variable = 'VARIABLE'
}

export type VisitClosureRequirement = {
  __typename?: 'VisitClosureRequirement';
  details?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  met: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type VisitClosureValidationResult = {
  __typename?: 'VisitClosureValidationResult';
  blockingReasons?: Maybe<Array<Scalars['String']['output']>>;
  canClose: Scalars['Boolean']['output'];
  requirements: Array<VisitClosureRequirement>;
  summary?: Maybe<Scalars['String']['output']>;
};

export type VisitComplaint = {
  __typename?: 'VisitComplaint';
  code?: Maybe<Scalars['String']['output']>;
  complaint: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  recordedByStaffId: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  visitId: Scalars['ID']['output'];
};

export type VisitCreationResult = {
  __typename?: 'VisitCreationResult';
  patientOutstandingBalance: PatientOutstandingBalanceResult;
  visit: Visit;
};

export type VisitCredit = {
  __typename?: 'VisitCredit';
  amount: Scalars['Float']['output'];
  confirmedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  method: CreditResolutionMethod;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  processedByStaffId: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  status: CreditRefundStatus;
  updatedAt: Scalars['DateTime']['output'];
  visit: Visit;
  visitCharge?: Maybe<VisitCharge>;
  visitChargeId?: Maybe<Scalars['ID']['output']>;
  visitId: Scalars['ID']['output'];
};

export type VisitCurrentTotals = {
  __typename?: 'VisitCurrentTotals';
  discountTotal: Scalars['Float']['output'];
  outstandingBalance: Scalars['Float']['output'];
  subtotal: Scalars['Float']['output'];
  surchargeTotal: Scalars['Float']['output'];
  totalPaid: Scalars['Float']['output'];
  totalPayable: Scalars['Float']['output'];
};

export type VisitDiagnosis = {
  __typename?: 'VisitDiagnosis';
  createdAt: Scalars['DateTime']['output'];
  diagnosedByStaffId: Scalars['ID']['output'];
  diagnosis: Scalars['String']['output'];
  diagnosisCode?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  visitId: Scalars['ID']['output'];
};

export type VisitInvoice = {
  __typename?: 'VisitInvoice';
  discountTotal: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  invoiceNumber: Scalars['String']['output'];
  issuedAt?: Maybe<Scalars['DateTime']['output']>;
  lockedAt?: Maybe<Scalars['DateTime']['output']>;
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  outstandingBalance?: Maybe<Scalars['Float']['output']>;
  status: VisitInvoiceStatus;
  subtotal: Scalars['Float']['output'];
  totalPaid?: Maybe<Scalars['Float']['output']>;
  totalPayable: Scalars['Float']['output'];
  visit: Visit;
  visitId: Scalars['ID']['output'];
};

export type VisitInvoiceAdjustmentSnapshot = {
  __typename?: 'VisitInvoiceAdjustmentSnapshot';
  amount?: Maybe<Scalars['Float']['output']>;
  billingAdjustment?: Maybe<BillingAdjustment>;
  billingAdjustmentId: Scalars['ID']['output'];
  direction?: Maybe<AdjustmentDirection>;
  id: Scalars['ID']['output'];
  invoiceId: Scalars['ID']['output'];
  method: AdjustmentMethod;
  organizationId: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  resolvedAmount: Scalars['Float']['output'];
  type: AdjustmentType;
  value?: Maybe<Scalars['Float']['output']>;
};

export type VisitInvoiceDetail = {
  __typename?: 'VisitInvoiceDetail';
  adjustmentSnapshots: Array<VisitInvoiceAdjustmentSnapshot>;
  balancePayments: Array<VisitBalancePayment>;
  credits: Array<VisitCredit>;
  invoice: VisitInvoice;
  lineItems: Array<VisitInvoiceLineItem>;
  outstandingBalance: Scalars['Float']['output'];
  payments: Array<VisitPayment>;
};

export type VisitInvoiceLineItem = {
  __typename?: 'VisitInvoiceLineItem';
  chargeDomain?: Maybe<ChargeDomain>;
  chargeName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  invoiceId: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  totalAmount: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  visitCharge?: Maybe<VisitCharge>;
  visitChargeId: Scalars['ID']['output'];
};

export enum VisitInvoiceStatus {
  Draft = 'DRAFT',
  Issued = 'ISSUED',
  Paid = 'PAID',
  PartiallyPaid = 'PARTIALLY_PAID'
}

export type VisitNote = {
  __typename?: 'VisitNote';
  author: Staff;
  authorStaffId: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  note: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  visit: Visit;
  visitId: Scalars['ID']['output'];
};

export type VisitNotePosition = {
  __typename?: 'VisitNotePosition';
  id: Scalars['ID']['output'];
  positionX: Scalars['Float']['output'];
  positionY: Scalars['Float']['output'];
  staff: Staff;
  staffId: Scalars['ID']['output'];
  visitNote: VisitNote;
  visitNoteId: Scalars['ID']['output'];
  zIndex: Scalars['Int']['output'];
};

export type VisitOutstandingBalance = {
  __typename?: 'VisitOutstandingBalance';
  outstandingBalance: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  totalAdjustments?: Maybe<Scalars['Float']['output']>;
  totalCharges: Scalars['Float']['output'];
  totalPaid: Scalars['Float']['output'];
  visitDate: Scalars['DateTime']['output'];
  visitId: Scalars['String']['output'];
  visitType?: Maybe<Scalars['String']['output']>;
};

export type VisitPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  status?: InputMaybe<VisitStatus>;
  visitType?: InputMaybe<VisitType>;
};

export type VisitPaginationResult = {
  __typename?: 'VisitPaginationResult';
  items: Array<Visit>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type VisitPayment = {
  __typename?: 'VisitPayment';
  allocations: Array<VisitPaymentAllocation>;
  amountPaid: Scalars['Float']['output'];
  confirmedAt?: Maybe<Scalars['DateTime']['output']>;
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  invoiceId?: Maybe<Scalars['ID']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['ID']['output'];
  paidAt: Scalars['DateTime']['output'];
  paymentMethod: PaymentMethod;
  receivedByStaffId: Scalars['ID']['output'];
  reference?: Maybe<Scalars['String']['output']>;
  status: PaymentStatus;
  visitId: Scalars['ID']['output'];
};

export type VisitPaymentAllocation = {
  __typename?: 'VisitPaymentAllocation';
  amountAllocated: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  organizationId: Scalars['ID']['output'];
  payment: VisitPayment;
  paymentId: Scalars['ID']['output'];
  visitCharge: VisitCharge;
  visitChargeId: Scalars['ID']['output'];
};

export type VisitPrescription = {
  __typename?: 'VisitPrescription';
  createdAt: Scalars['DateTime']['output'];
  dose?: Maybe<Scalars['String']['output']>;
  drug: Scalars['String']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  frequency?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isProvidedInHouse: Scalars['Boolean']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  prescribingDoctor: Staff;
  prescribingDoctorId: Scalars['ID']['output'];
  route?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  visit: Visit;
  visitCharge?: Maybe<VisitCharge>;
  visitId: Scalars['ID']['output'];
};

export type VisitProcedure = {
  __typename?: 'VisitProcedure';
  bedAllocation?: Maybe<VisitBedAllocation>;
  cancellationReason?: Maybe<Scalars['String']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  customProcedureCode?: Maybe<Scalars['String']['output']>;
  customProcedureName?: Maybe<Scalars['String']['output']>;
  estimatedDuration?: Maybe<Scalars['Int']['output']>;
  events: Array<VisitProcedureEvent>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  orderedAt: Scalars['DateTime']['output'];
  orderedBy: Staff;
  outcome?: Maybe<VisitProcedureOutcome>;
  performedBy: Staff;
  priority?: Maybe<VisitProcedurePriority>;
  procedureCatalog?: Maybe<ChargeCatalog>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: VisitProcedureStatus;
  visit: Visit;
  visitId: Scalars['ID']['output'];
};

export type VisitProcedureEvent = {
  __typename?: 'VisitProcedureEvent';
  createdBy: Staff;
  createdByStaffId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  occurredAt: Scalars['DateTime']['output'];
  procedure: VisitProcedure;
  procedureId: Scalars['ID']['output'];
  type: VisitProcedureEventType;
};

export type VisitProcedureEventPaginationInput = {
  from?: InputMaybe<Scalars['DateTime']['input']>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  procedureId?: InputMaybe<Scalars['ID']['input']>;
  to?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type VisitProcedureEventPaginationResult = {
  __typename?: 'VisitProcedureEventPaginationResult';
  items: Array<VisitProcedureEvent>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

/** Type of the procedure event */
export enum VisitProcedureEventType {
  Completed = 'COMPLETED',
  Complication = 'COMPLICATION',
  Note = 'NOTE',
  Paused = 'PAUSED',
  Resumed = 'RESUMED',
  Started = 'STARTED',
  StepCompleted = 'STEP_COMPLETED'
}

export enum VisitProcedureOutcome {
  Complication = 'COMPLICATION',
  Failed = 'FAILED',
  Partial = 'PARTIAL',
  Success = 'SUCCESS'
}

export type VisitProcedurePaginationInput = {
  limit: Scalars['Float']['input'];
  page: Scalars['Float']['input'];
  priority?: InputMaybe<VisitProcedurePriority>;
  status?: InputMaybe<VisitProcedureStatus>;
  visitId?: InputMaybe<Scalars['ID']['input']>;
};

export type VisitProcedurePaginationResult = {
  __typename?: 'VisitProcedurePaginationResult';
  items: Array<VisitProcedure>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum VisitProcedurePriority {
  High = 'HIGH',
  Low = 'LOW',
  Normal = 'NORMAL',
  Urgent = 'URGENT'
}

export enum VisitProcedureStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type VisitReconcileResult = {
  __typename?: 'VisitReconcileResult';
  blockingReasons?: Maybe<Array<Scalars['String']['output']>>;
  canClose?: Maybe<Scalars['Boolean']['output']>;
  canReconcile: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  outstandingBalance?: Maybe<Scalars['Float']['output']>;
};

/** Current status of a visit */
export enum VisitStatus {
  Admitted = 'ADMITTED',
  Cancelled = 'CANCELLED',
  Closed = 'CLOSED',
  Discharged = 'DISCHARGED',
  Open = 'OPEN',
  Reconciled = 'RECONCILED'
}

export type VisitTask = {
  __typename?: 'VisitTask';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  completedBy?: Maybe<Staff>;
  completedByStaffId?: Maybe<Scalars['ID']['output']>;
  createdBy?: Maybe<Staff>;
  createdByStaffId?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dueAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  isEmailSent: Scalars['Boolean']['output'];
  status: VisitTaskStatus;
  taskType: VisitTaskType;
  visit: Visit;
  visitId: Scalars['ID']['output'];
};

/** Status of a visit task */
export enum VisitTaskStatus {
  Cancelled = 'CANCELLED',
  Done = 'DONE',
  Pending = 'PENDING'
}

/** Type of task associated with a visit */
export enum VisitTaskType {
  FollowUp = 'FOLLOW_UP',
  Imaging = 'IMAGING',
  Lab = 'LAB',
  Other = 'OTHER',
  Referral = 'REFERRAL'
}

/** Type of patient visit */
export enum VisitType {
  Admission = 'ADMISSION',
  Consultation = 'CONSULTATION',
  Emergency = 'EMERGENCY',
  Laboratory = 'LABORATORY',
  Opd = 'OPD',
  Surgery = 'SURGERY',
  Telemedicine = 'TELEMEDICINE'
}

export type VisitVital = {
  __typename?: 'VisitVital';
  bloodPressure?: Maybe<Scalars['String']['output']>;
  bmi?: Maybe<Scalars['Float']['output']>;
  heartRate?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  recordedByStaffId: Scalars['ID']['output'];
  respiratoryRate?: Maybe<Scalars['Float']['output']>;
  spo2?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  visitId: Scalars['ID']['output'];
  weight?: Maybe<Scalars['Float']['output']>;
};

export enum WalletTransactionStatus {
  Confirmed = 'CONFIRMED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Requested = 'REQUESTED'
}

export enum WalletTransactionType {
  Grant = 'GRANT',
  Spend = 'SPEND',
  TopUp = 'TOP_UP',
  TransferIn = 'TRANSFER_IN'
}

export type Ward = {
  __typename?: 'Ward';
  code?: Maybe<Scalars['String']['output']>;
  department: WardDepartment;
  floor?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  organization: Organization;
  organizationId: Scalars['ID']['output'];
  wardClass: WardClass;
};

export enum WardClass {
  Isolation = 'ISOLATION',
  Premium = 'PREMIUM',
  Standard = 'STANDARD',
  Vip = 'VIP'
}

/** Department type for a ward */
export enum WardDepartment {
  General = 'GENERAL',
  Icu = 'ICU',
  Obstetrics = 'OBSTETRICS',
  Pediatrics = 'PEDIATRICS',
  Surgery = 'SURGERY'
}

export type WardIncident = {
  __typename?: 'WardIncident';
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organization: Organization;
  organizationId: Scalars['String']['output'];
  reportedAt: Scalars['DateTime']['output'];
  reportedBy: Staff;
  reportedByStaffId: Scalars['String']['output'];
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  severity: WardIncidentSeverity;
  status: WardIncidentStatus;
  type: WardIncidentType;
  ward: Ward;
  wardId: Scalars['String']['output'];
};

export type WardIncidentPaginationInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  severity?: InputMaybe<WardIncidentSeverity>;
  status?: InputMaybe<WardIncidentStatus>;
  type?: InputMaybe<WardIncidentType>;
  wardId?: InputMaybe<Scalars['ID']['input']>;
};

export type WardIncidentPaginationResult = {
  __typename?: 'WardIncidentPaginationResult';
  items: Array<WardIncident>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum WardIncidentSeverity {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum WardIncidentStatus {
  Active = 'ACTIVE',
  Escalated = 'ESCALATED',
  Resolved = 'RESOLVED'
}

export enum WardIncidentType {
  EquipmentFailure = 'EQUIPMENT_FAILURE',
  FireOutbreak = 'FIRE_OUTBREAK',
  GasLeak = 'GAS_LEAK',
  PowerFailure = 'POWER_FAILURE',
  SecurityBreach = 'SECURITY_BREACH',
  WaterLeak = 'WATER_LEAK'
}

export type WardPaginationInput = {
  department?: InputMaybe<WardDepartment>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  wardClass?: InputMaybe<WardClass>;
};

export type WardPaginationResult = {
  __typename?: 'WardPaginationResult';
  items: Array<Ward>;
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type WhoAmIDto = {
  __typename?: 'WhoAmIDto';
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  lastSeenAt?: Maybe<Scalars['DateTime']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  roles: Array<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  userCode: Scalars['Float']['output'];
};

export type StaffLoginMutationVariables = Exact<{
  input: StaffLoginInput;
}>;


export type StaffLoginMutation = { __typename?: 'Mutation', staffLogin: { __typename?: 'LoginAuthResponse', accessToken: string, refreshToken?: string | null } };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthResponse', accessToken: string, refreshToken?: string | null } };

export type WhoAmIQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoAmIQuery = { __typename?: 'Query', whoAmI: { __typename?: 'WhoAmIDto', email: string, roles: Array<string>, userCode: number, status: string, phoneNumber?: string | null, lastLoginAt?: string | null, lastSeenAt?: string | null } };

export type GetAllStaffQueryVariables = Exact<{
  pagination?: StaffPaginationInput;
}>;


export type GetAllStaffQuery = { __typename?: 'Query', staffs: { __typename?: 'PaginatedStaff', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Staff', id: string, fullName: string, email: string, userCode: number, userType: UserType, roles: Array<StaffRole>, status: StaffStatus, phoneNumber?: string | null, organizationId: string }> } };

export type GetStaffByRoleQueryVariables = Exact<{
  role: StaffRole;
}>;


export type GetStaffByRoleQuery = { __typename?: 'Query', staffByRole: Array<{ __typename?: 'Staff', id: string, fullName: string, email: string, userCode: number, userType: UserType, roles: Array<StaffRole>, status: StaffStatus, phoneNumber?: string | null, organizationId: string }> };

export type CreateStaffMutationVariables = Exact<{
  data: CreateStaffInput;
}>;


export type CreateStaffMutation = { __typename?: 'Mutation', createStaff: { __typename?: 'Staff', id: string, fullName: string, email: string, userCode: number, userType: UserType, roles: Array<StaffRole>, phoneNumber?: string | null, organizationId: string } };

export type GetStaffByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetStaffByIdQuery = { __typename?: 'Query', staffById: { __typename?: 'Staff', id: string, fullName: string, email: string, phoneNumber?: string | null, roles: Array<StaffRole>, userCode: number, status: StaffStatus } };

export type UpdateStaffMutationVariables = Exact<{
  data: UpdateStaffInput;
}>;


export type UpdateStaffMutation = { __typename?: 'Mutation', updateStaff: { __typename?: 'Staff', id: string, fullName: string, email: string, phoneNumber?: string | null, roles: Array<StaffRole> } };

export type UpdateStaffRolesMutationVariables = Exact<{
  data: UpdateStaffRolesInput;
}>;


export type UpdateStaffRolesMutation = { __typename?: 'Mutation', updateStaffRoles: { __typename?: 'Staff', id: string, fullName: string, email: string, roles: Array<StaffRole> } };

export type UpdateStaffStatusMutationVariables = Exact<{
  data: UpdateStaffStatusInput;
}>;


export type UpdateStaffStatusMutation = { __typename?: 'Mutation', updateStaffStatus: { __typename?: 'Staff', id: string, fullName: string, email: string, userCode: number, roles: Array<StaffRole>, status: StaffStatus, organizationId: string } };

export type UpdateStaffPasswordMutationVariables = Exact<{
  input: UpdateStaffPasswordInput;
}>;


export type UpdateStaffPasswordMutation = { __typename?: 'Mutation', updateStaffPassword: boolean };

export type CreatePatientMutationVariables = Exact<{
  data: CreatePatientInput;
}>;


export type CreatePatientMutation = { __typename?: 'Mutation', createPatient: { __typename?: 'CreatePatientResult', warning?: string | null, patient: { __typename?: 'Patient', id: string, patientNumber: string, fullName?: string | null, gender: string, phoneNumber?: string | null, email?: string | null, bloodGroup?: BloodGroup | null, emergency: boolean }, matches?: Array<{ __typename?: 'DuplicatePatientMatch', patientId: string, patientNumber: string, fullName: string, confidence: number }> | null } };

export type GetAllPatientsQueryVariables = Exact<{
  pagination: PatientPaginationInput;
}>;


export type GetAllPatientsQuery = { __typename?: 'Query', patients: { __typename?: 'PatientPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Patient', id: string, patientNumber: string, fullName?: string | null, gender: string, phoneNumber?: string | null, email?: string | null, bloodGroup?: BloodGroup | null, emergency: boolean, status: PatientStatus }> } };

export type GetPatientByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetPatientByIdQuery = { __typename?: 'Query', patientById: { __typename?: 'Patient', id: string, fullName?: string | null, dateOfBirth?: string | null, gender: string, phoneNumber?: string | null, secondaryPhoneNumber?: string | null, email?: string | null, patientNumber: string, userCode: number, status: PatientStatus, bloodGroup?: BloodGroup | null, allergies?: Array<string> | null, emergency: boolean, extraDetails?: string | null, nextOfKinName?: string | null, nextOfKinPhone?: string | null, createdByStaffId?: string | null, likelyDuplicatePatientIds?: Array<string> | null, addresses?: Array<{ __typename?: 'Address', addressLine1: string, city: string, state: string, country: string } | null> | null } };

export type UpdatePatientMutationVariables = Exact<{
  data: UpdatePatientInput;
}>;


export type UpdatePatientMutation = { __typename?: 'Mutation', updatePatient: { __typename?: 'Patient', id: string, userCode: number } };

export type CreateVisitMutationVariables = Exact<{
  data: CreateVisitInput;
}>;


export type CreateVisitMutation = { __typename?: 'Mutation', createVisit: { __typename?: 'VisitCreationResult', visit: { __typename?: 'Visit', id: string, status: VisitStatus, visitType: VisitType, visitDateTime: string, patient: { __typename?: 'Patient', id: string, fullName?: string | null, userCode: number, email?: string | null } }, patientOutstandingBalance: { __typename?: 'PatientOutstandingBalanceResult', patientId: string, patientName: string, patientUserCode?: number | null, totalOutstandingBalance: number, totalChargesAcrossAllVisits: number, totalPaidAcrossAllVisits: number, visitOutstandings: Array<{ __typename?: 'VisitOutstandingBalance', visitId: string, visitDate: string, visitType?: string | null, outstandingBalance: number, totalCharges: number, totalPaid: number, totalAdjustments?: number | null, status: string }> } } };

export type FindAllVisitsQueryVariables = Exact<{
  pagination: VisitPaginationInput;
}>;


export type FindAllVisitsQuery = { __typename?: 'Query', visits: { __typename?: 'VisitPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Visit', id: string, visitType: VisitType, status: VisitStatus, visitDateTime: string, attendingStaffId?: string | null, patient: { __typename?: 'Patient', id: string, fullName?: string | null, email?: string | null, phoneNumber?: string | null } }> } };

export type GetPatientVisitHistoryQueryVariables = Exact<{
  patientId: Scalars['String']['input'];
}>;


export type GetPatientVisitHistoryQuery = { __typename?: 'Query', patientVisitHistory: Array<{ __typename?: 'Visit', id: string, visitType: VisitType, status: VisitStatus, visitDateTime: string, attendingStaffId?: string | null }> };

export type GetVisitByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetVisitByIdQuery = { __typename?: 'Query', visit: { __typename?: 'Visit', id: string, visitType: VisitType, status: VisitStatus, visitDateTime: string, closedAt?: string | null, patientId: string, attendingStaffId?: string | null, patient: { __typename?: 'Patient', id: string, fullName?: string | null, email?: string | null, phoneNumber?: string | null } } };

export type GetGlobalBillingCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGlobalBillingCategoriesQuery = { __typename?: 'Query', globalBillingCategories: Array<{ __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, items?: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null }> | null }> };

export type GetOrganizationBillingCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationBillingCategoriesQuery = { __typename?: 'Query', organizationBillingCategories: Array<{ __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, items?: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null }> | null }> };

export type GetBillingCategoryByIdQueryVariables = Exact<{
  categoryId: Scalars['String']['input'];
}>;


export type GetBillingCategoryByIdQuery = { __typename?: 'Query', billingCategoryById: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, items?: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null }> | null } };

export type CreateBillingCategoryMutationVariables = Exact<{
  data: CreateBillingCategoryInput;
}>;


export type CreateBillingCategoryMutation = { __typename?: 'Mutation', createBillingCategory: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null } };

export type UpdateBillingCategoryMutationVariables = Exact<{
  data: UpdateBillingCategoryInput;
}>;


export type UpdateBillingCategoryMutation = { __typename?: 'Mutation', updateBillingCategory: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null } };

export type CreateBillingItemMutationVariables = Exact<{
  data: CreateBillingItemInput;
}>;


export type CreateBillingItemMutation = { __typename?: 'Mutation', createBillingItem: { __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null } };

export type CloneGlobalCategoryToOrganizationMutationVariables = Exact<{
  categoryId: Scalars['String']['input'];
}>;


export type CloneGlobalCategoryToOrganizationMutation = { __typename?: 'Mutation', cloneGlobalCategoryToOrganization: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, items?: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null }> | null } };

export type OrganizationChargeItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationChargeItemsQuery = { __typename?: 'Query', organizationChargeItems: Array<{ __typename?: 'GlobalBillingCatalogueItem', id: string, code: string, name: string, description?: string | null, organizationId?: string | null, category?: { __typename?: 'BillingCatalogueCategory', id: string, code: string, name: string, description?: string | null } | null }> };

export type OrganizationChargeCatalogsQueryVariables = Exact<{
  pagination: ChargeCatalogPaginationInput;
}>;


export type OrganizationChargeCatalogsQuery = { __typename?: 'Query', organizationChargeCatalogs: { __typename?: 'ChargeCatalogPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'ChargeCatalog', id: string, code: string, name: string, unitPrice: number, billingType: BillingType, currency: string, isActive: boolean, description?: string | null, category: { __typename?: 'BillingCatalogueCategory', id: string, name: string, code: string }, catalogueItem: { __typename?: 'GlobalBillingCatalogueItem', id: string, name: string, code: string } }> } };

export type CreateChargeCatalogMutationVariables = Exact<{
  data: CreateChargeCatalogInput;
}>;


export type CreateChargeCatalogMutation = { __typename?: 'Mutation', createChargeCatalog: { __typename?: 'ChargeCatalog', id: string, code: string, name: string, unitPrice: number, billingType: BillingType, currency: string, isActive: boolean, description?: string | null, category: { __typename?: 'BillingCatalogueCategory', id: string, name: string }, catalogueItem: { __typename?: 'GlobalBillingCatalogueItem', id: string, name: string, code: string } } };

export type UpdateChargeCatalogMutationVariables = Exact<{
  data: UpdateChargeCatalogInput;
}>;


export type UpdateChargeCatalogMutation = { __typename?: 'Mutation', updateChargeCatalog: { __typename?: 'ChargeCatalog', id: string, code: string, name: string, unitPrice: number, billingType: BillingType, currency: string, isActive: boolean, description?: string | null, categoryId: string, catalogueItemId: string, category: { __typename?: 'BillingCatalogueCategory', id: string, name: string, code: string } } };

export type CreateVisitVitalMutationVariables = Exact<{
  data: CreateVisitVitalInput;
}>;


export type CreateVisitVitalMutation = { __typename?: 'Mutation', createVisitVital: { __typename?: 'VisitVital', id: string, visitId: string, temperature?: number | null, bloodPressure?: string | null, heartRate?: number | null, respiratoryRate?: number | null, spo2?: number | null, weight?: number | null, height?: number | null, bmi?: number | null, notes?: string | null, recordedByStaffId: string } };

export type UpdateVisitVitalMutationVariables = Exact<{
  data: UpdateVisitVitalInput;
}>;


export type UpdateVisitVitalMutation = { __typename?: 'Mutation', updateVisitVital: { __typename?: 'VisitVital', id: string, visitId: string, temperature?: number | null, bloodPressure?: string | null, heartRate?: number | null, respiratoryRate?: number | null, spo2?: number | null, weight?: number | null, height?: number | null, bmi?: number | null, notes?: string | null, recordedByStaffId: string } };

export type VisitVitalsQueryVariables = Exact<{
  visitId: Scalars['String']['input'];
}>;


export type VisitVitalsQuery = { __typename?: 'Query', visitVitals: Array<{ __typename?: 'VisitVital', id: string, temperature?: number | null, bloodPressure?: string | null, heartRate?: number | null, respiratoryRate?: number | null, spo2?: number | null, weight?: number | null, height?: number | null, bmi?: number | null, notes?: string | null, recordedByStaffId: string }> };

export type ChargeDomainMappingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ChargeDomainMappingsQuery = { __typename?: 'Query', chargeDomainMappings: Array<{ __typename?: 'ChargeDomainCatalogMapping', id: string, organizationId: string, chargeDomain: ChargeDomain, chargeCatalogId: string, chargeCatalog: { __typename?: 'ChargeCatalog', id: string, name: string, billingType: BillingType, code: string, unitPrice: number, isActive: boolean } }> };

export type SyncChargeDomainMappingMutationVariables = Exact<{
  data: SyncChargeDomainMappingInput;
}>;


export type SyncChargeDomainMappingMutation = { __typename?: 'Mutation', syncChargeDomainMapping: Array<{ __typename?: 'ChargeDomainCatalogMapping', id: string, organizationId: string, chargeDomain: ChargeDomain, chargeCatalogId: string, chargeCatalog: { __typename?: 'ChargeCatalog', id: string, name: string, billingType: BillingType, unitPrice: number, code: string, isActive: boolean } }> };

export type GetAuditDistinctValuesQueryVariables = Exact<{
  field: AuditDistinctField;
}>;


export type GetAuditDistinctValuesQuery = { __typename?: 'Query', getAuditDistinctValues: Array<string> };

export type GetAuditLogByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetAuditLogByIdQuery = { __typename?: 'Query', getAuditLogById: { __typename?: 'AuditLog', id: string, organizationId: string, actorId?: string | null, actorType?: string | null, actorDescription?: string | null, action: string, entity: string, appName: string, metadata?: Record<string, unknown> | null, createdAt: string } };

export type GetAuditLogsQueryVariables = Exact<{
  pagination: AuditPaginationInput;
}>;


export type GetAuditLogsQuery = { __typename?: 'Query', auditLogs: { __typename?: 'AuditPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'AuditLog', id: string, actorId?: string | null, actorType?: string | null, action: string, entity: string, appName: string, createdAt: string }> } };

export type GetActorActivityStatsQueryVariables = Exact<{
  period: ActorActivityPeriod;
}>;


export type GetActorActivityStatsQuery = { __typename?: 'Query', getActorActivityStats: { __typename?: 'ActorActivityStats', actorId: string, period: ActorActivityPeriod, total: number, buckets: Array<{ __typename?: 'ActorActivityBucket', label: string, timestamp: string, count: number }> } };

export type CatalogsByChargeDomainQueryVariables = Exact<{
  chargeDomain: ChargeDomain;
}>;


export type CatalogsByChargeDomainQuery = { __typename?: 'Query', catalogsByChargeDomain: Array<{ __typename?: 'ChargeDomainCatalogMapping', id: string, chargeDomain: ChargeDomain, chargeCatalogId: string, organizationId: string, chargeCatalog: { __typename?: 'ChargeCatalog', id: string, name: string, description?: string | null, unitPrice: number, currency: string } }> };

export type VisitChargeExistsByDomainQueryVariables = Exact<{
  visitId: Scalars['String']['input'];
  chargeDomain: ChargeDomain;
}>;


export type VisitChargeExistsByDomainQuery = { __typename?: 'Query', visitChargeExistsByDomain: boolean };

export type VisitComplaintsQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type VisitComplaintsQuery = { __typename?: 'Query', visitComplaints: Array<{ __typename?: 'VisitComplaint', id: string, visitId: string, complaint: string, code?: string | null, recordedByStaffId: string, createdAt: string, updatedAt: string }> };

export type VisitComplaintByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type VisitComplaintByIdQuery = { __typename?: 'Query', visitComplaintById: { __typename?: 'VisitComplaint', id: string, visitId: string, complaint: string, code?: string | null, recordedByStaffId: string, createdAt: string, updatedAt: string } };

export type CreateVisitComplaintMutationVariables = Exact<{
  data: CreateVisitComplaintInput;
}>;


export type CreateVisitComplaintMutation = { __typename?: 'Mutation', createVisitComplaint: { __typename?: 'VisitComplaint', id: string, visitId: string, complaint: string, code?: string | null, recordedByStaffId: string, createdAt: string, updatedAt: string } };

export type CreateVisitChargeMutationVariables = Exact<{
  data: CreateVisitChargeInput;
}>;


export type CreateVisitChargeMutation = { __typename?: 'Mutation', createVisitCharge: { __typename?: 'VisitCharge', id: string, visitId: string, quantity: number, unitPrice: number } };

export type UpdateVisitChargeMutationVariables = Exact<{
  data: UpdateVisitChargeInput;
}>;


export type UpdateVisitChargeMutation = { __typename?: 'Mutation', updateVisitCharge: { __typename?: 'VisitCharge', id: string, visitId: string, quantity: number, unitPrice: number } };

export type UpdateVisitComplaintMutationVariables = Exact<{
  data: UpdateVisitComplaintInput;
}>;


export type UpdateVisitComplaintMutation = { __typename?: 'Mutation', updateVisitComplaint: { __typename?: 'VisitComplaint', id: string, complaint: string, code?: string | null, visitId: string, createdAt: string, updatedAt: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type VisitDiagnosesQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type VisitDiagnosesQuery = { __typename?: 'Query', visitDiagnoses: Array<{ __typename?: 'VisitDiagnosis', id: string, visitId: string, diagnosisCode?: string | null, diagnosis: string, notes?: string | null, diagnosedByStaffId: string, createdAt: string, updatedAt: string }> };

export type VisitDiagnosisByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type VisitDiagnosisByIdQuery = { __typename?: 'Query', visitDiagnosisById: { __typename?: 'VisitDiagnosis', id: string, visitId: string, diagnosisCode?: string | null, diagnosis: string, notes?: string | null, diagnosedByStaffId: string, createdAt: string, updatedAt: string } };

export type CreateVisitDiagnosisMutationVariables = Exact<{
  data: CreateVisitDiagnosisInput;
}>;


export type CreateVisitDiagnosisMutation = { __typename?: 'Mutation', createVisitDiagnosis: { __typename?: 'VisitDiagnosis', id: string, visitId: string, diagnosisCode?: string | null, diagnosis: string, notes?: string | null, diagnosedByStaffId: string, createdAt: string, updatedAt: string } };

export type UpdateVisitDiagnosisMutationVariables = Exact<{
  data: UpdateVisitDiagnosisInput;
}>;


export type UpdateVisitDiagnosisMutation = { __typename?: 'Mutation', updateVisitDiagnosis: { __typename?: 'VisitDiagnosis', id: string, visitId: string, diagnosisCode?: string | null, diagnosis: string, notes?: string | null, diagnosedByStaffId: string, createdAt: string, updatedAt: string } };

export type GetVisitsByPatientUserCodeQueryVariables = Exact<{
  userCode: Scalars['Int']['input'];
}>;


export type GetVisitsByPatientUserCodeQuery = { __typename?: 'Query', visitsByPatientUserCode: Array<{ __typename?: 'Visit', id: string, status: VisitStatus, visitType: VisitType, visitDateTime: string, patient: { __typename?: 'Patient', id: string, fullName?: string | null, userCode: number, patientNumber: string, email?: string | null, phoneNumber?: string | null, gender: string } }> };

export type CreateLabRequestMutationVariables = Exact<{
  data: CreateLabRequestInput;
}>;


export type CreateLabRequestMutation = { __typename?: 'Mutation', createLabRequest: { __typename?: 'CreateLabRequestResponse', success: boolean, requiresConfirmation?: boolean | null, duplicates?: Array<{ __typename?: 'DuplicateWarning', chargeCatalogId: string, name: string, createdAt: string }> | null, previousRequests?: Array<{ __typename?: 'DuplicateWarning', chargeCatalogId: string, name: string, createdAt: string }> | null, labRequest?: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, requestedByStaffId: string, organizationId: string, createdAt: string, updatedAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }> } | null } };

export type FindAllLabRequestsQueryVariables = Exact<{
  pagination: LabRequestPaginationInput;
}>;


export type FindAllLabRequestsQuery = { __typename?: 'Query', labRequests: { __typename?: 'LabRequestPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'LabRequest', id: string, priority: LabPriority, status: LabRequestStatus, createdAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }>, visit: { __typename?: 'Visit', id: string, visitType: VisitType, visitDateTime: string } }> } };

export type UpdateLabRequestMutationVariables = Exact<{
  data: UpdateLabRequestInput;
}>;


export type UpdateLabRequestMutation = { __typename?: 'Mutation', updateLabRequest: { __typename?: 'CreateLabRequestResponse', success: boolean, requiresConfirmation?: boolean | null, duplicates?: Array<{ __typename?: 'DuplicateWarning', chargeCatalogId: string, name: string, createdAt: string }> | null, previousRequests?: Array<{ __typename?: 'DuplicateWarning', chargeCatalogId: string, name: string, createdAt: string }> | null, labRequest?: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, requestedByStaffId: string, organizationId: string, createdAt: string, updatedAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }> } | null } };

export type StartLabRequestMutationVariables = Exact<{
  labRequestId: Scalars['ID']['input'];
}>;


export type StartLabRequestMutation = { __typename?: 'Mutation', startLabRequest: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, createdAt: string, updatedAt: string } };

export type CompleteLabRequestMutationVariables = Exact<{
  labRequestId: Scalars['ID']['input'];
}>;


export type CompleteLabRequestMutation = { __typename?: 'Mutation', completeLabRequest: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, createdAt: string, updatedAt: string } };

export type FindLabRequestsByVisitQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type FindLabRequestsByVisitQuery = { __typename?: 'Query', labRequestsByVisit: Array<{ __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, requestedByStaffId: string, organizationId: string, createdAt: string, updatedAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }> }> };

export type FindLabRequestByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FindLabRequestByIdQuery = { __typename?: 'Query', labRequestById: { __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, requestedByStaffId: string, organizationId: string, createdAt: string, updatedAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }>, visit: { __typename?: 'Visit', id: string, visitType: VisitType, visitDateTime: string, patient: { __typename?: 'Patient', id: string, fullName?: string | null, dateOfBirth?: string | null, gender: string } }, organization: { __typename?: 'Organization', id: string, name: string, email?: string | null, phoneNumber?: string | null, website?: string | null, address?: { __typename?: 'Address', addressLine1: string, city: string, state: string, country: string } | null } } };

export type GetLabRequestsByVisitQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetLabRequestsByVisitQuery = { __typename?: 'Query', labRequestsByVisit: Array<{ __typename?: 'LabRequest', id: string, visitId: string, priority: LabPriority, status: LabRequestStatus, createdAt: string, updatedAt: string, tests: Array<{ __typename?: 'LabRequestTest', chargeCatalogId: string, testName: string }> }> };

export type CreateLabResultMutationVariables = Exact<{
  data: CreateLabResultInput;
}>;


export type CreateLabResultMutation = { __typename?: 'Mutation', createLabResult: { __typename?: 'LabResult', id: string, labRequestId: string, testName: string, chargeCatalogId: string, performedByStaffId: string, items?: Array<{ __typename?: 'LabResultItem', id: string, parameter: string, value: string, unit?: string | null, referenceRange?: string | null, interpretation?: string | null }> | null } };

export type LabResultsByLabRequestQueryVariables = Exact<{
  labRequestId: Scalars['ID']['input'];
}>;


export type LabResultsByLabRequestQuery = { __typename?: 'Query', labResultsByLabRequest: Array<{ __typename?: 'LabResult', id: string, labRequestId: string, testName: string, chargeCatalogId: string, performedByStaffId: string, items?: Array<{ __typename?: 'LabResultItem', id: string, parameter: string, value: string, unit?: string | null, referenceRange?: string | null, interpretation?: string | null }> | null }> };

export type UpdateLabResultMutationVariables = Exact<{
  data: UpdateLabResultInput;
}>;


export type UpdateLabResultMutation = { __typename?: 'Mutation', updateLabResult: { __typename?: 'LabResult', id: string, labRequestId: string, testName: string, chargeCatalogId: string, performedByStaffId: string, items?: Array<{ __typename?: 'LabResultItem', id: string, parameter: string, value: string, unit?: string | null, referenceRange?: string | null, interpretation?: string | null }> | null } };

export type FindVisitPrescriptionsQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type FindVisitPrescriptionsQuery = { __typename?: 'Query', visitPrescriptions: Array<{ __typename?: 'VisitPrescription', id: string, visitId: string, drug: string, dose?: string | null, route?: string | null, frequency?: string | null, isProvidedInHouse: boolean, startDate?: string | null, endDate?: string | null, notes?: string | null, prescribingDoctorId: string, createdAt: string, updatedAt: string, prescribingDoctor: { __typename?: 'Staff', id: string, fullName: string }, visit: { __typename?: 'Visit', id: string, visitType: VisitType, visitDateTime: string, patient: { __typename?: 'Patient', id: string, fullName?: string | null, dateOfBirth?: string | null, gender: string }, organization: { __typename?: 'Organization', id: string, name: string, email?: string | null, phoneNumber?: string | null, website?: string | null, address?: { __typename?: 'Address', addressLine1: string, city: string, state: string, country: string } | null } } }> };

export type CreateVisitPrescriptionMutationVariables = Exact<{
  data: CreateVisitPrescriptionInput;
}>;


export type CreateVisitPrescriptionMutation = { __typename?: 'Mutation', createVisitPrescription: { __typename?: 'VisitPrescription', id: string, visitId: string, drug: string, dose?: string | null, route?: string | null, frequency?: string | null, isProvidedInHouse: boolean, startDate?: string | null, endDate?: string | null, notes?: string | null, prescribingDoctorId: string, createdAt: string, updatedAt: string } };

export type UpdateVisitPrescriptionMutationVariables = Exact<{
  data: UpdateVisitPrescriptionInput;
}>;


export type UpdateVisitPrescriptionMutation = { __typename?: 'Mutation', updateVisitPrescription: { __typename?: 'VisitPrescription', id: string, visitId: string, drug: string, dose?: string | null, route?: string | null, frequency?: string | null, isProvidedInHouse: boolean, startDate?: string | null, endDate?: string | null, notes?: string | null, prescribingDoctorId: string, createdAt: string, updatedAt: string } };

export type GetWardsQueryVariables = Exact<{
  pagination: WardPaginationInput;
}>;


export type GetWardsQuery = { __typename?: 'Query', wards: { __typename?: 'WardPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Ward', id: string, name: string, code?: string | null, floor?: number | null, department: WardDepartment, wardClass: WardClass, organizationId: string, isActive: boolean }> } };

export type GetWardByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWardByIdQuery = { __typename?: 'Query', wardById: { __typename?: 'Ward', id: string, name: string, code?: string | null, floor?: number | null, department: WardDepartment, wardClass: WardClass, organizationId: string, isActive: boolean } };

export type CreateWardMutationVariables = Exact<{
  data: CreateWardInput;
}>;


export type CreateWardMutation = { __typename?: 'Mutation', createWard: { __typename?: 'Ward', id: string, name: string, code?: string | null, floor?: number | null, department: WardDepartment, wardClass: WardClass, organizationId: string, isActive: boolean } };

export type UpdateWardMutationVariables = Exact<{
  data: UpdateWardInput;
}>;


export type UpdateWardMutation = { __typename?: 'Mutation', updateWard: { __typename?: 'Ward', id: string, name: string, code?: string | null, floor?: number | null, department: WardDepartment, wardClass: WardClass, organizationId: string, isActive: boolean } };

export type GetWardIncidentsQueryVariables = Exact<{
  pagination: WardIncidentPaginationInput;
}>;


export type GetWardIncidentsQuery = { __typename?: 'Query', wardIncidents: { __typename?: 'WardIncidentPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'WardIncident', id: string, wardId: string, organizationId: string, reportedByStaffId: string, type: WardIncidentType, severity: WardIncidentSeverity, status: WardIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, ward: { __typename?: 'Ward', id: string, name: string, code?: string | null, department: WardDepartment, wardClass: WardClass }, reportedBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }> } };

export type GetWardIncidentsByWardQueryVariables = Exact<{
  wardId: Scalars['ID']['input'];
  pagination: WardIncidentPaginationInput;
}>;


export type GetWardIncidentsByWardQuery = { __typename?: 'Query', wardIncidentsByWard: { __typename?: 'WardIncidentPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'WardIncident', id: string, wardId: string, organizationId: string, reportedByStaffId: string, type: WardIncidentType, severity: WardIncidentSeverity, status: WardIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, ward: { __typename?: 'Ward', id: string, name: string, code?: string | null, department: WardDepartment, wardClass: WardClass }, reportedBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }> } };

export type GetWardIncidentByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWardIncidentByIdQuery = { __typename?: 'Query', wardIncidentById: { __typename?: 'WardIncident', id: string, wardId: string, organizationId: string, reportedByStaffId: string, type: WardIncidentType, severity: WardIncidentSeverity, status: WardIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, ward: { __typename?: 'Ward', id: string, name: string, code?: string | null, floor?: number | null, department: WardDepartment, wardClass: WardClass, isActive: boolean }, reportedBy: { __typename?: 'Staff', id: string, fullName: string, userCode: number } } };

export type CreateWardIncidentMutationVariables = Exact<{
  data: CreateWardIncidentInput;
}>;


export type CreateWardIncidentMutation = { __typename?: 'Mutation', createWardIncident: { __typename?: 'WardIncident', id: string, wardId: string, organizationId: string, reportedByStaffId: string, type: WardIncidentType, severity: WardIncidentSeverity, status: WardIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, ward: { __typename?: 'Ward', id: string, name: string, code?: string | null }, reportedBy: { __typename?: 'Staff', id: string, fullName: string, userCode: number } } };

export type UpdateWardIncidentMutationVariables = Exact<{
  data: UpdateWardIncidentInput;
}>;


export type UpdateWardIncidentMutation = { __typename?: 'Mutation', updateWardIncident: { __typename?: 'WardIncident', id: string, wardId: string, organizationId: string, reportedByStaffId: string, type: WardIncidentType, severity: WardIncidentSeverity, status: WardIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, ward: { __typename?: 'Ward', id: string, name: string, code?: string | null }, reportedBy: { __typename?: 'Staff', id: string, fullName: string, userCode: number } } };

export type GetBedsQueryVariables = Exact<{
  pagination: BedPaginationInput;
}>;


export type GetBedsQuery = { __typename?: 'Query', beds: { __typename?: 'BedPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Bed', id: string, wardId: string, organizationId: string, name: string, bedCode: string, class: BedClass, status: BedStatus, isActive: boolean }> } };

export type CreateBedMutationVariables = Exact<{
  data: CreateBedInput;
}>;


export type CreateBedMutation = { __typename?: 'Mutation', createBed: { __typename?: 'Bed', id: string, wardId: string, organizationId: string, name: string, bedCode: string, class: BedClass, status: BedStatus, isActive: boolean } };

export type UpdateBedMutationVariables = Exact<{
  data: UpdateBedInput;
}>;


export type UpdateBedMutation = { __typename?: 'Mutation', updateBed: { __typename?: 'Bed', id: string, wardId: string, organizationId: string, name: string, bedCode: string, class: BedClass, status: BedStatus, isActive: boolean } };

export type GetVisitProceduresQueryVariables = Exact<{
  pagination: VisitProcedurePaginationInput;
}>;


export type GetVisitProceduresQuery = { __typename?: 'Query', visitProcedures: { __typename?: 'VisitProcedurePaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'VisitProcedure', id: string, visitId: string, customProcedureName?: string | null, customProcedureCode?: string | null, status: VisitProcedureStatus, priority?: VisitProcedurePriority | null, outcome?: VisitProcedureOutcome | null, orderedAt: string, startedAt?: string | null, completedAt?: string | null, cancelledAt?: string | null, estimatedDuration?: number | null, cancellationReason?: string | null, notes?: string | null, visit: { __typename?: 'Visit', id: string }, orderedBy: { __typename?: 'Staff', id: string, fullName: string }, procedureCatalog?: { __typename?: 'ChargeCatalog', id: string, name: string, code: string } | null, bedAllocation?: { __typename?: 'VisitBedAllocation', id: string, bedId: string } | null }> } };

export type GetVisitProceduresByVisitQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitProceduresByVisitQuery = { __typename?: 'Query', visitProceduresByVisit: Array<{ __typename?: 'VisitProcedure', id: string, customProcedureName?: string | null, customProcedureCode?: string | null, status: VisitProcedureStatus, priority?: VisitProcedurePriority | null, outcome?: VisitProcedureOutcome | null, orderedAt: string, startedAt?: string | null, completedAt?: string | null, cancelledAt?: string | null, estimatedDuration?: number | null, cancellationReason?: string | null, notes?: string | null, orderedBy: { __typename?: 'Staff', id: string, fullName: string }, procedureCatalog?: { __typename?: 'ChargeCatalog', id: string, name: string, code: string } | null, bedAllocation?: { __typename?: 'VisitBedAllocation', id: string } | null }> };

export type GetVisitProcedureByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetVisitProcedureByIdQuery = { __typename?: 'Query', visitProcedureById: { __typename?: 'VisitProcedure', id: string, visitId: string, customProcedureName?: string | null, customProcedureCode?: string | null, status: VisitProcedureStatus, priority?: VisitProcedurePriority | null, outcome?: VisitProcedureOutcome | null, orderedAt: string, startedAt?: string | null, completedAt?: string | null, cancelledAt?: string | null, estimatedDuration?: number | null, cancellationReason?: string | null, notes?: string | null, visit: { __typename?: 'Visit', id: string }, orderedBy: { __typename?: 'Staff', id: string, fullName: string }, procedureCatalog?: { __typename?: 'ChargeCatalog', id: string, name: string, code: string } | null, bedAllocation?: { __typename?: 'VisitBedAllocation', id: string, bedId: string } | null } };

export type CreateVisitProcedureMutationVariables = Exact<{
  data: CreateVisitProcedureInput;
}>;


export type CreateVisitProcedureMutation = { __typename?: 'Mutation', createVisitProcedure: { __typename?: 'CreateVisitProcedureResponse', success: boolean, procedure?: { __typename?: 'VisitProcedure', id: string, customProcedureName?: string | null, customProcedureCode?: string | null, status: VisitProcedureStatus, priority?: VisitProcedurePriority | null, procedureCatalog?: { __typename?: 'ChargeCatalog', id: string, name: string } | null } | null } };

export type UpdateVisitProcedureMutationVariables = Exact<{
  data: UpdateVisitProcedureInput;
}>;


export type UpdateVisitProcedureMutation = { __typename?: 'Mutation', updateVisitProcedure: { __typename?: 'VisitProcedure', id: string, customProcedureName?: string | null, customProcedureCode?: string | null, status: VisitProcedureStatus, priority?: VisitProcedurePriority | null, outcome?: VisitProcedureOutcome | null } };

export type CancelVisitProcedureMutationVariables = Exact<{
  procedureId: Scalars['ID']['input'];
  cancellationReason: Scalars['String']['input'];
}>;


export type CancelVisitProcedureMutation = { __typename?: 'Mutation', cancelVisitProcedure: { __typename?: 'VisitProcedure', id: string, customProcedureName?: string | null, customProcedureCode?: string | null, status: VisitProcedureStatus, priority?: VisitProcedurePriority | null, outcome?: VisitProcedureOutcome | null, cancellationReason?: string | null, cancelledAt?: string | null, procedureCatalog?: { __typename?: 'ChargeCatalog', id: string, name: string, code: string } | null } };

export type GetVisitProcedureEventsQueryVariables = Exact<{
  pagination: VisitProcedureEventPaginationInput;
}>;


export type GetVisitProcedureEventsQuery = { __typename?: 'Query', visitProcedureEvents: { __typename?: 'VisitProcedureEventPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'VisitProcedureEvent', id: string, procedureId: string, type: VisitProcedureEventType, message: string, metadata?: Record<string, unknown> | null, occurredAt: string, createdBy: { __typename?: 'Staff', id: string, fullName: string }, procedure: { __typename?: 'VisitProcedure', id: string, status: VisitProcedureStatus, priority?: VisitProcedurePriority | null } }> } };

export type CreateVisitProcedureEventMutationVariables = Exact<{
  data: CreateVisitProcedureEventInput;
}>;


export type CreateVisitProcedureEventMutation = { __typename?: 'Mutation', createVisitProcedureEvent: { __typename?: 'VisitProcedureEvent', id: string, procedureId: string, type: VisitProcedureEventType, message: string, metadata?: Record<string, unknown> | null, occurredAt: string, createdBy: { __typename?: 'Staff', id: string, fullName: string }, procedure: { __typename?: 'VisitProcedure', id: string, status: VisitProcedureStatus, priority?: VisitProcedurePriority | null } } };

export type GetVisitProcedureStaffQueryVariables = Exact<{
  procedureId: Scalars['ID']['input'];
}>;


export type GetVisitProcedureStaffQuery = { __typename?: 'Query', visitProcedureStaff: Array<{ __typename?: 'ProcedureStaffResult', id: string, staffId: string, staffName: string, userCode?: string | null, functionInProcedure: StaffFunction }> };

export type BulkAssignVisitProcedureStaffMutationVariables = Exact<{
  data: BulkAssignProcedureStaffInput;
}>;


export type BulkAssignVisitProcedureStaffMutation = { __typename?: 'Mutation', bulkAssignVisitProcedureStaff: Array<{ __typename?: 'ProcedureStaffResult', id: string, staffId: string, staffName: string, userCode?: string | null, functionInProcedure: StaffFunction }> };

export type UpdateVisitProcedureStaffMutationVariables = Exact<{
  data: UpdateProcedureStaffInput;
}>;


export type UpdateVisitProcedureStaffMutation = { __typename?: 'Mutation', updateVisitProcedureStaff: Array<{ __typename?: 'ProcedureStaffResult', id: string, staffId: string, staffName: string, userCode?: string | null, functionInProcedure: StaffFunction }> };

export type GetTheatresQueryVariables = Exact<{
  pagination: TheatrePaginationInput;
}>;


export type GetTheatresQuery = { __typename?: 'Query', theatres: { __typename?: 'TheatrePaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Theatre', id: string, name: string, code?: string | null, floor?: number | null, department?: TheatreDepartment | null, capacity?: number | null, organizationId: string, isActive: boolean }> } };

export type GetTheatreByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTheatreByIdQuery = { __typename?: 'Query', theatreById: { __typename?: 'Theatre', id: string, name: string, code?: string | null, floor?: number | null, department?: TheatreDepartment | null, capacity?: number | null, organizationId: string, isActive: boolean } };

export type CreateTheatreMutationVariables = Exact<{
  data: CreateTheatreInput;
}>;


export type CreateTheatreMutation = { __typename?: 'Mutation', createTheatre: { __typename?: 'Theatre', id: string, name: string, code?: string | null, floor?: number | null, department?: TheatreDepartment | null, capacity?: number | null, organizationId: string, isActive: boolean } };

export type UpdateTheatreMutationVariables = Exact<{
  data: UpdateTheatreInput;
}>;


export type UpdateTheatreMutation = { __typename?: 'Mutation', updateTheatre: { __typename?: 'Theatre', id: string, name: string, code?: string | null, floor?: number | null, department?: TheatreDepartment | null, capacity?: number | null, organizationId: string, isActive: boolean } };

export type GetTheatreIncidentsQueryVariables = Exact<{
  pagination: TheatreIncidentPaginationInput;
}>;


export type GetTheatreIncidentsQuery = { __typename?: 'Query', theatreIncidents: { __typename?: 'TheatreIncidentPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'TheatreIncident', id: string, theatreId: string, organizationId: string, reportedByStaffId: string, type: TheatreIncidentType, severity: TheatreIncidentSeverity, status: TheatreIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string, floor?: number | null, isActive: boolean }, reportedBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }> } };

export type GetTheatreIncidentsByTheatreQueryVariables = Exact<{
  theatreId: Scalars['ID']['input'];
  pagination: TheatreIncidentPaginationInput;
}>;


export type GetTheatreIncidentsByTheatreQuery = { __typename?: 'Query', theatreIncidentsByTheatre: { __typename?: 'TheatreIncidentPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'TheatreIncident', id: string, theatreId: string, organizationId: string, reportedByStaffId: string, type: TheatreIncidentType, severity: TheatreIncidentSeverity, status: TheatreIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string, floor?: number | null, isActive: boolean }, reportedBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }> } };

export type GetTheatreIncidentByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTheatreIncidentByIdQuery = { __typename?: 'Query', theatreIncidentById: { __typename?: 'TheatreIncident', id: string, theatreId: string, organizationId: string, reportedByStaffId: string, type: TheatreIncidentType, severity: TheatreIncidentSeverity, status: TheatreIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string, floor?: number | null, isActive: boolean }, reportedBy: { __typename?: 'Staff', id: string, fullName: string, userCode: number } } };

export type CreateTheatreIncidentMutationVariables = Exact<{
  data: CreateTheatreIncidentInput;
}>;


export type CreateTheatreIncidentMutation = { __typename?: 'Mutation', createTheatreIncident: { __typename?: 'TheatreIncident', id: string, theatreId: string, organizationId: string, reportedByStaffId: string, type: TheatreIncidentType, severity: TheatreIncidentSeverity, status: TheatreIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string }, reportedBy: { __typename?: 'Staff', id: string, fullName: string, userCode: number } } };

export type UpdateTheatreIncidentMutationVariables = Exact<{
  data: UpdateTheatreIncidentInput;
}>;


export type UpdateTheatreIncidentMutation = { __typename?: 'Mutation', updateTheatreIncident: { __typename?: 'TheatreIncident', id: string, theatreId: string, organizationId: string, reportedByStaffId: string, type: TheatreIncidentType, severity: TheatreIncidentSeverity, status: TheatreIncidentStatus, reportedAt: string, resolvedAt?: string | null, notes?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string }, reportedBy: { __typename?: 'Staff', id: string, fullName: string, userCode: number } } };

export type AvailableTheatresForTimeRangeQueryVariables = Exact<{
  pagination: AvailableTheatrePaginationInput;
}>;


export type AvailableTheatresForTimeRangeQuery = { __typename?: 'Query', availableTheatresForTimeRange: { __typename?: 'TheatrePaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'Theatre', id: string, name: string, code?: string | null, floor?: number | null, department?: TheatreDepartment | null, capacity?: number | null, organizationId: string, isActive: boolean }> } };

export type TheatreScheduleForDayQueryVariables = Exact<{
  theatreId: Scalars['ID']['input'];
  date: Scalars['DateTime']['input'];
}>;


export type TheatreScheduleForDayQuery = { __typename?: 'Query', theatreScheduleForDay: { __typename?: 'TheatreScheduleForDay', date: string, computedStatus: TheatreScheduleStatus, theatre: { __typename?: 'Theatre', id: string, name: string, code?: string | null, floor?: number | null, department?: TheatreDepartment | null, capacity?: number | null, isActive: boolean, organizationId: string }, availability: Array<{ __typename?: 'TheatreAvailability', id: string, theatreId: string, dayOfWeek: number, startTime: string, endTime: string, type: TheatreAvailabilityType, notes?: string | null, isActive: boolean, createdByStaffId: string }>, blocks: Array<{ __typename?: 'TheatreBlock', id: string, theatreId: string, startTime: string, endTime: string, type: TheatreBlockType, status: TheatreBlockStatus, isActive: boolean, reason?: string | null, createdByStaffId: string }>, bookings: Array<{ __typename?: 'TheatreBooking', id: string, theatreId: string, scheduledStartTime: string, scheduledEndTime: string, status: TheatreBookingStatus, procedure: { __typename?: 'VisitProcedure', id: string, customProcedureName?: string | null, customProcedureCode?: string | null, procedureCatalog?: { __typename?: 'ChargeCatalog', name: string } | null } }> } };

export type ActiveBlocksForTheatreQueryVariables = Exact<{
  theatreId: Scalars['ID']['input'];
}>;


export type ActiveBlocksForTheatreQuery = { __typename?: 'Query', activeBlocksForTheatre: Array<{ __typename?: 'TheatreBlock', id: string, theatreId: string, startTime: string, endTime: string, type: TheatreBlockType, status: TheatreBlockStatus, isActive: boolean, reason?: string | null, createdByStaffId: string, createdBy: { __typename?: 'Staff', id: string, fullName: string } }> };

export type TheatreAvailabilitiesQueryVariables = Exact<{
  theatreId: Scalars['ID']['input'];
}>;


export type TheatreAvailabilitiesQuery = { __typename?: 'Query', theatreAvailabilities: Array<{ __typename?: 'TheatreAvailability', id: string, theatreId: string, dayOfWeek: number, startTime: string, endTime: string, type: TheatreAvailabilityType, notes?: string | null, isActive: boolean, createdByStaffId: string }> };

export type SyncTheatreAvailabilityMutationVariables = Exact<{
  data: SyncTheatreAvailabilityInput;
}>;


export type SyncTheatreAvailabilityMutation = { __typename?: 'Mutation', syncTheatreAvailability: Array<{ __typename?: 'TheatreAvailability', id: string, theatreId: string, dayOfWeek: number, startTime: string, endTime: string, type: TheatreAvailabilityType, notes?: string | null, isActive: boolean, createdByStaffId: string }> };

export type CreateTheatreBlockMutationVariables = Exact<{
  data: CreateTheatreBlockInput;
}>;


export type CreateTheatreBlockMutation = { __typename?: 'Mutation', createTheatreBlock: { __typename?: 'TheatreBlock', id: string, theatreId: string, startTime: string, endTime: string, type: TheatreBlockType, status: TheatreBlockStatus, isActive: boolean, reason?: string | null, createdByStaffId: string, createdBy: { __typename?: 'Staff', id: string, fullName: string } } };

export type UpdateTheatreBlockMutationVariables = Exact<{
  data: UpdateTheatreBlockInput;
}>;


export type UpdateTheatreBlockMutation = { __typename?: 'Mutation', updateTheatreBlock: { __typename?: 'TheatreBlock', id: string, theatreId: string, startTime: string, endTime: string, type: TheatreBlockType, status: TheatreBlockStatus, isActive: boolean, reason?: string | null, createdByStaffId: string, createdBy: { __typename?: 'Staff', id: string, fullName: string } } };

export type ResolveTheatreBlockMutationVariables = Exact<{
  data: ResolveTheatreBlockInput;
}>;


export type ResolveTheatreBlockMutation = { __typename?: 'Mutation', resolveTheatreBlock: { __typename?: 'TheatreBlock', id: string, theatreId: string, startTime: string, endTime: string, type: TheatreBlockType, status: TheatreBlockStatus, isActive: boolean, reason?: string | null, createdByStaffId: string, createdBy: { __typename?: 'Staff', id: string, fullName: string } } };

export type CreateTheatreBookingMutationVariables = Exact<{
  data: CreateTheatreBookingInput;
}>;


export type CreateTheatreBookingMutation = { __typename?: 'Mutation', createTheatreBooking: { __typename?: 'TheatreBooking', id: string, theatreId: string, procedureId: string, scheduledStartTime: string, scheduledEndTime: string, actualStartTime?: string | null, actualEndTime?: string | null, status: TheatreBookingStatus, priority: TheatreBookingPriority, estimatedDurationMinutes?: number | null, actualDurationMinutes?: number | null, bookedByStaffId: string, notes?: string | null, delayReason?: string | null, cancellationReason?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string }, procedure: { __typename?: 'VisitProcedure', id: string }, bookedBy: { __typename?: 'Staff', id: string, fullName: string } } };

export type UpdateTheatreBookingMutationVariables = Exact<{
  data: UpdateTheatreBookingInput;
}>;


export type UpdateTheatreBookingMutation = { __typename?: 'Mutation', updateTheatreBooking: { __typename?: 'TheatreBooking', id: string, theatreId: string, procedureId: string, scheduledStartTime: string, scheduledEndTime: string, actualStartTime?: string | null, actualEndTime?: string | null, status: TheatreBookingStatus, priority: TheatreBookingPriority, estimatedDurationMinutes?: number | null, actualDurationMinutes?: number | null, bookedByStaffId: string, notes?: string | null, delayReason?: string | null, cancellationReason?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string }, procedure: { __typename?: 'VisitProcedure', id: string }, bookedBy: { __typename?: 'Staff', id: string, fullName: string } } };

export type CancelTheatreBookingMutationVariables = Exact<{
  data: CancelTheatreBookingInput;
}>;


export type CancelTheatreBookingMutation = { __typename?: 'Mutation', cancelTheatreBooking: { __typename?: 'TheatreBooking', id: string, status: TheatreBookingStatus, cancellationReason?: string | null, scheduledStartTime: string, scheduledEndTime: string, theatre: { __typename?: 'Theatre', id: string, name: string }, procedure: { __typename?: 'VisitProcedure', id: string } } };

export type ReallocateTheatreBookingMutationVariables = Exact<{
  data: ReallocateTheatreBookingInput;
}>;


export type ReallocateTheatreBookingMutation = { __typename?: 'Mutation', reallocateTheatreBooking: { __typename?: 'TheatreBooking', id: string, theatreId: string, scheduledStartTime: string, scheduledEndTime: string, status: TheatreBookingStatus, theatre: { __typename?: 'Theatre', id: string, name: string }, procedure: { __typename?: 'VisitProcedure', id: string } } };

export type DelayTheatreBookingMutationVariables = Exact<{
  data: DelayTheatreBookingInput;
}>;


export type DelayTheatreBookingMutation = { __typename?: 'Mutation', delayTheatreBooking: { __typename?: 'TheatreBooking', id: string, scheduledStartTime: string, scheduledEndTime: string, status: TheatreBookingStatus, delayReason?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string }, procedure: { __typename?: 'VisitProcedure', id: string } } };

export type StartTheatreProcedureMutationVariables = Exact<{
  data: StartTheatreProcedureInput;
}>;


export type StartTheatreProcedureMutation = { __typename?: 'Mutation', startTheatreProcedure: { __typename?: 'TheatreBooking', id: string, status: TheatreBookingStatus, scheduledStartTime: string, scheduledEndTime: string, actualStartTime?: string | null, actualEndTime?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string }, procedure: { __typename?: 'VisitProcedure', id: string } } };

export type CompleteTheatreProcedureMutationVariables = Exact<{
  data: CompleteTheatreProcedureInput;
}>;


export type CompleteTheatreProcedureMutation = { __typename?: 'Mutation', completeTheatreProcedure: { __typename?: 'TheatreBooking', id: string, status: TheatreBookingStatus, actualStartTime?: string | null, actualEndTime?: string | null, actualDurationMinutes?: number | null, theatre: { __typename?: 'Theatre', id: string, name: string }, procedure: { __typename?: 'VisitProcedure', id: string } } };

export type AbortTheatreBookingMutationVariables = Exact<{
  data: CancelTheatreBookingInput;
}>;


export type AbortTheatreBookingMutation = { __typename?: 'Mutation', abortTheatreBooking: { __typename?: 'TheatreBooking', id: string, status: TheatreBookingStatus, cancellationReason?: string | null, scheduledStartTime: string, scheduledEndTime: string, theatre: { __typename?: 'Theatre', id: string, name: string }, procedure: { __typename?: 'VisitProcedure', id: string } } };

export type GetProcedureTheatreBookingsQueryVariables = Exact<{
  procedureId: Scalars['ID']['input'];
}>;


export type GetProcedureTheatreBookingsQuery = { __typename?: 'Query', getProcedureTheatreBookings: Array<{ __typename?: 'TheatreBooking', id: string, theatreId: string, procedureId: string, scheduledStartTime: string, scheduledEndTime: string, actualStartTime?: string | null, actualEndTime?: string | null, status: TheatreBookingStatus, priority: TheatreBookingPriority, estimatedDurationMinutes?: number | null, actualDurationMinutes?: number | null, bookedByStaffId: string, notes?: string | null, delayReason?: string | null, cancellationReason?: string | null, theatre: { __typename?: 'Theatre', id: string, name: string }, procedure: { __typename?: 'VisitProcedure', id: string, status: VisitProcedureStatus, events: Array<{ __typename?: 'VisitProcedureEvent', id: string, type: VisitProcedureEventType, message: string, occurredAt: string, createdBy: { __typename?: 'Staff', id: string, fullName: string } }> } }> };

export type FindBedAllocationByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FindBedAllocationByIdQuery = { __typename?: 'Query', bedAllocationById: { __typename?: 'VisitBedAllocation', id: string, visitId: string, bedId: string, organizationId: string, status: VisitBedAllocationStatus, allocatedAt: string, releasedAt?: string | null, allocatedByStaffId: string, releasedByStaffId?: string | null, reason?: string | null, bed: { __typename?: 'Bed', id: string, wardId: string, name: string, bedCode: string, class: BedClass, status: BedStatus, isActive: boolean }, visit: { __typename?: 'Visit', id: string, visitType: VisitType, visitDateTime: string, status: VisitStatus }, allocatedBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string }, releasedBy?: { __typename?: 'Staff', id: string, userCode: number, fullName: string } | null } };

export type GetBedAllocationsByVisitQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetBedAllocationsByVisitQuery = { __typename?: 'Query', bedAllocationsByVisit: Array<{ __typename?: 'VisitBedAllocation', id: string, visitId: string, bedId: string, organizationId: string, status: VisitBedAllocationStatus, allocatedAt: string, releasedAt?: string | null, allocatedByStaffId: string, releasedByStaffId?: string | null, reason?: string | null, bed: { __typename?: 'Bed', id: string, wardId: string, name: string, bedCode: string, class: BedClass, status: BedStatus, isActive: boolean }, allocatedBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string }, releasedBy?: { __typename?: 'Staff', id: string, userCode: number, fullName: string } | null }> };

export type GetBedAllocationsByWardQueryVariables = Exact<{
  wardId: Scalars['ID']['input'];
}>;


export type GetBedAllocationsByWardQuery = { __typename?: 'Query', visitBedAllocationsByWard: Array<{ __typename?: 'VisitBedAllocation', id: string, visitId: string, bedId: string, organizationId: string, status: VisitBedAllocationStatus, allocatedAt: string, releasedAt?: string | null, allocatedByStaffId: string, releasedByStaffId?: string | null, reason?: string | null, bed: { __typename?: 'Bed', id: string, wardId: string, name: string, bedCode: string, class: BedClass, status: BedStatus, isActive: boolean }, allocatedBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string }, releasedBy?: { __typename?: 'Staff', id: string, userCode: number, fullName: string } | null }> };

export type CreateBedAllocationMutationVariables = Exact<{
  data: CreateVisitBedAllocationInput;
}>;


export type CreateBedAllocationMutation = { __typename?: 'Mutation', createBedAllocation: { __typename?: 'VisitBedAllocation', id: string, visitId: string, bedId: string, organizationId: string, status: VisitBedAllocationStatus, allocatedAt: string, allocatedByStaffId: string, reason?: string | null, bed: { __typename?: 'Bed', id: string, name: string, bedCode: string, class: BedClass, status: BedStatus } } };

export type UpdateBedAllocationStatusMutationVariables = Exact<{
  data: UpdateVisitBedAllocationStatusInput;
}>;


export type UpdateBedAllocationStatusMutation = { __typename?: 'Mutation', updateBedAllocationStatus: { __typename?: 'VisitBedAllocation', id: string, visitId: string, bedId: string, organizationId: string, status: VisitBedAllocationStatus, allocatedAt: string, releasedAt?: string | null, allocatedByStaffId: string, releasedByStaffId?: string | null, reason?: string | null, bed: { __typename?: 'Bed', id: string, name: string, bedCode: string, class: BedClass, status: BedStatus } } };

export type TransferBedAllocationMutationVariables = Exact<{
  data: TransferVisitBedAllocationInput;
}>;


export type TransferBedAllocationMutation = { __typename?: 'Mutation', transferBedAllocation: { __typename?: 'VisitBedAllocation', id: string, visitId: string, bedId: string, organizationId: string, status: VisitBedAllocationStatus, allocatedAt: string, allocatedByStaffId: string, reason?: string | null, bed: { __typename?: 'Bed', id: string, name: string, bedCode: string, class: BedClass, status: BedStatus } } };

export type GetVisitNotesByVisitQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitNotesByVisitQuery = { __typename?: 'Query', visitNotesByVisit: Array<{ __typename?: 'VisitNote', id: string, visitId: string, note: string, authorStaffId: string, createdAt: string, updatedAt: string, author: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }> };

export type CreateVisitNoteMutationVariables = Exact<{
  data: CreateVisitNoteInput;
}>;


export type CreateVisitNoteMutation = { __typename?: 'Mutation', createVisitNote: { __typename?: 'VisitNote', id: string, visitId: string, note: string, authorStaffId: string, createdAt: string, updatedAt: string, author: { __typename?: 'Staff', id: string, userCode: number, fullName: string } } };

export type UpdateVisitNoteMutationVariables = Exact<{
  data: UpdateVisitNoteInput;
}>;


export type UpdateVisitNoteMutation = { __typename?: 'Mutation', updateVisitNote: { __typename?: 'VisitNote', id: string, visitId: string, note: string, authorStaffId: string, createdAt: string, updatedAt: string, author: { __typename?: 'Staff', id: string, userCode: number, fullName: string } } };

export type GetVisitNotePositionsByVisitQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitNotePositionsByVisitQuery = { __typename?: 'Query', visitNotePositionsByVisit: Array<{ __typename?: 'VisitNotePosition', id: string, visitNoteId: string, staffId: string, positionX: number, positionY: number, zIndex: number }> };

export type UpsertVisitNotePositionMutationVariables = Exact<{
  data: UpsertVisitNotePositionInput;
}>;


export type UpsertVisitNotePositionMutation = { __typename?: 'Mutation', upsertVisitNotePosition: { __typename?: 'VisitNotePosition', id: string, visitNoteId: string, staffId: string, positionX: number, positionY: number, zIndex: number } };

export type GetVisitTasksByVisitQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitTasksByVisitQuery = { __typename?: 'Query', visitTasksByVisit: Array<{ __typename?: 'VisitTask', id: string, visitId: string, taskType: VisitTaskType, description?: string | null, status: VisitTaskStatus, dueAt?: string | null, isEmailSent: boolean, createdByStaffId?: string | null, completedByStaffId?: string | null, completedAt?: string | null, createdBy?: { __typename?: 'Staff', id: string, userCode: number, fullName: string } | null, completedBy?: { __typename?: 'Staff', id: string, userCode: number, fullName: string } | null }> };

export type CreateVisitTaskMutationVariables = Exact<{
  data: CreateVisitTaskInput;
}>;


export type CreateVisitTaskMutation = { __typename?: 'Mutation', createVisitTask: { __typename?: 'VisitTask', id: string, visitId: string, taskType: VisitTaskType, description?: string | null, status: VisitTaskStatus, dueAt?: string | null, isEmailSent: boolean, createdByStaffId?: string | null, createdBy?: { __typename?: 'Staff', id: string, userCode: number, fullName: string } | null } };

export type UpdateVisitTaskMutationVariables = Exact<{
  data: UpdateVisitTaskInput;
}>;


export type UpdateVisitTaskMutation = { __typename?: 'Mutation', updateVisitTask: { __typename?: 'VisitTask', id: string, visitId: string, taskType: VisitTaskType, description?: string | null, status: VisitTaskStatus, dueAt?: string | null, isEmailSent: boolean, createdByStaffId?: string | null, createdBy?: { __typename?: 'Staff', id: string, userCode: number, fullName: string } | null } };

export type UpdateVisitTaskStatusMutationVariables = Exact<{
  data: UpdateVisitTaskStatusInput;
}>;


export type UpdateVisitTaskStatusMutation = { __typename?: 'Mutation', updateVisitTaskStatus: { __typename?: 'VisitTask', id: string, visitId: string, taskType: VisitTaskType, status: VisitTaskStatus, dueAt?: string | null, isEmailSent: boolean, completedByStaffId?: string | null, completedAt?: string | null, completedBy?: { __typename?: 'Staff', id: string, userCode: number, fullName: string } | null } };

export type ChangeStaffPasswordMutationVariables = Exact<{
  input: UpdateStaffPasswordInput;
}>;


export type ChangeStaffPasswordMutation = { __typename?: 'Mutation', changeStaffPassword: { __typename?: 'AuthResponse', accessToken: string, refreshToken?: string | null } };

export type GetVisitChargeSummaryQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitChargeSummaryQuery = { __typename?: 'Query', visitChargeSummary: { __typename?: 'VisitChargeSummary', total: number, lockedCharges: Array<{ __typename?: 'VisitCharge', id: string, visitId: string, chargeCatalogId?: string | null, chargeName: string, description?: string | null, quantity: number, unitPrice: number, totalAmount?: number | null, overrideReason?: string | null, status: VisitChargeStatus, chargeType: VisitChargeType, billingType?: BillingType | null, chargeDomain?: ChargeDomain | null, organizationId: string, notes?: string | null, chargeCatalog?: { __typename?: 'ChargeCatalog', id: string, name: string } | null, createdBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }>, editableCharges: Array<{ __typename?: 'VisitCharge', id: string, visitId: string, chargeCatalogId?: string | null, chargeName: string, description?: string | null, quantity: number, unitPrice: number, totalAmount?: number | null, overrideReason?: string | null, status: VisitChargeStatus, chargeType: VisitChargeType, billingType?: BillingType | null, chargeDomain?: ChargeDomain | null, organizationId: string, notes?: string | null, chargeCatalog?: { __typename?: 'ChargeCatalog', id: string, name: string } | null, createdBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }> } };

export type GetVisitChargeTotalQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitChargeTotalQuery = { __typename?: 'Query', visitChargeTotal: number };

export type GetUnbilledPrescriptionsQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetUnbilledPrescriptionsQuery = { __typename?: 'Query', unbilledPrescriptions: Array<{ __typename?: 'VisitPrescription', id: string, visitId: string, drug: string, dose?: string | null, route?: string | null, frequency?: string | null, isProvidedInHouse: boolean, startDate?: string | null, endDate?: string | null, notes?: string | null, prescribingDoctorId: string, createdAt: string, updatedAt: string, visitCharge?: { __typename?: 'VisitCharge', id: string } | null, prescribingDoctor: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }> };

export type CreateChargeFromPrescriptionMutationVariables = Exact<{
  prescriptionId: Scalars['ID']['input'];
  unitPrice: Scalars['Float']['input'];
}>;


export type CreateChargeFromPrescriptionMutation = { __typename?: 'Mutation', createChargeFromPrescription: { __typename?: 'VisitCharge', id: string, visitId: string, chargeName: string, description?: string | null, quantity: number, unitPrice: number, totalAmount?: number | null, status: VisitChargeStatus, chargeType: VisitChargeType, billingType?: BillingType | null, chargeDomain?: ChargeDomain | null, organizationId: string, notes?: string | null } };

export type GetLatestVisitInvoiceQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetLatestVisitInvoiceQuery = { __typename?: 'Query', latestVisitInvoice?: { __typename?: 'VisitInvoice', id: string, visitId: string, invoiceNumber: string, status: VisitInvoiceStatus, subtotal: number, discountTotal: number, totalPayable: number, totalPaid?: number | null, outstandingBalance?: number | null, issuedAt?: string | null, lockedAt?: string | null, organizationId: string } | null };

export type GetVisitInvoicesQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitInvoicesQuery = { __typename?: 'Query', visitInvoices: Array<{ __typename?: 'VisitInvoice', id: string, visitId: string, invoiceNumber: string, status: VisitInvoiceStatus, subtotal: number, discountTotal: number, totalPayable: number, totalPaid?: number | null, outstandingBalance?: number | null, issuedAt?: string | null, lockedAt?: string | null, organizationId: string }> };

export type GenerateVisitInvoiceMutationVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GenerateVisitInvoiceMutation = { __typename?: 'Mutation', generateVisitInvoice: { __typename?: 'VisitInvoice', id: string, visitId: string, invoiceNumber: string, status: VisitInvoiceStatus, subtotal: number, discountTotal: number, totalPayable: number, issuedAt?: string | null, lockedAt?: string | null, organizationId: string } };

export type IssueVisitInvoiceMutationVariables = Exact<{
  invoiceId: Scalars['ID']['input'];
}>;


export type IssueVisitInvoiceMutation = { __typename?: 'Mutation', issueVisitInvoice: { __typename?: 'VisitInvoice', id: string, visitId: string, invoiceNumber: string, status: VisitInvoiceStatus, subtotal: number, discountTotal: number, totalPayable: number, issuedAt?: string | null, lockedAt?: string | null, organizationId: string } };

export type GetVisitCurrentTotalsQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitCurrentTotalsQuery = { __typename?: 'Query', visitCurrentTotals: { __typename?: 'VisitCurrentTotals', subtotal: number, discountTotal: number, surchargeTotal: number, totalPayable: number, totalPaid: number, outstandingBalance: number } };

export type GetVisitPaymentsQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitPaymentsQuery = { __typename?: 'Query', visitPayments: Array<{ __typename?: 'VisitPayment', id: string, visitId: string, invoiceId?: string | null, organizationId: string, amountPaid: number, currency: string, paymentMethod: PaymentMethod, status: PaymentStatus, paidAt: string, confirmedAt?: string | null, receivedByStaffId: string, reference?: string | null, notes?: string | null, allocations: Array<{ __typename?: 'VisitPaymentAllocation', id: string, visitChargeId: string, organizationId: string, amountAllocated: number, visitCharge: { __typename?: 'VisitCharge', id: string, chargeName: string, totalAmount?: number | null, status: VisitChargeStatus } }> }> };

export type CreateVisitPaymentMutationVariables = Exact<{
  data: CreateVisitPaymentInput;
}>;


export type CreateVisitPaymentMutation = { __typename?: 'Mutation', createVisitPayment: { __typename?: 'VisitPayment', id: string, visitId: string, invoiceId?: string | null, organizationId: string, amountPaid: number, currency: string, paymentMethod: PaymentMethod, status: PaymentStatus, paidAt: string, confirmedAt?: string | null, receivedByStaffId: string, reference?: string | null, notes?: string | null, allocations: Array<{ __typename?: 'VisitPaymentAllocation', id: string, visitChargeId: string, amountAllocated: number, visitCharge: { __typename?: 'VisitCharge', id: string, chargeName: string, totalAmount?: number | null, status: VisitChargeStatus } }> } };

export type ConfirmVisitPaymentMutationVariables = Exact<{
  paymentId: Scalars['ID']['input'];
}>;


export type ConfirmVisitPaymentMutation = { __typename?: 'Mutation', confirmVisitPayment: { __typename?: 'VisitPayment', id: string, status: PaymentStatus, confirmedAt?: string | null } };

export type FailVisitPaymentMutationVariables = Exact<{
  paymentId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type FailVisitPaymentMutation = { __typename?: 'Mutation', failVisitPayment: { __typename?: 'VisitPayment', id: string, status: PaymentStatus, notes?: string | null } };

export type RefundVisitPaymentMutationVariables = Exact<{
  paymentId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type RefundVisitPaymentMutation = { __typename?: 'Mutation', refundVisitPayment: { __typename?: 'VisitPayment', id: string, status: PaymentStatus, notes?: string | null } };

export type GetBillingAdjustmentsQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetBillingAdjustmentsQuery = { __typename?: 'Query', billingAdjustments: Array<{ __typename?: 'BillingAdjustment', id: string, visitId: string, invoiceId?: string | null, visitChargeId?: string | null, appliedOn: AdjustmentAppliedOn, type: AdjustmentType, method: AdjustmentMethod, value?: number | null, amount?: number | null, currency: string, reason: string, notes?: string | null, status: AdjustmentStatus, direction?: AdjustmentDirection | null, reversesAdjustmentId?: string | null, requestedByStaffId: string, approvedByStaffId?: string | null, appliedAt?: string | null, organizationId: string, reversesAdjustment?: { __typename?: 'BillingAdjustment', id: string, type: AdjustmentType, method: AdjustmentMethod, value?: number | null, amount?: number | null, direction?: AdjustmentDirection | null } | null, chargeLinks?: Array<{ __typename?: 'BillingAdjustmentCharge', id: string, visitChargeId: string, visitCharge: { __typename?: 'VisitCharge', id: string, chargeName: string, totalAmount?: number | null } }> | null }> };

export type RequestBillingAdjustmentMutationVariables = Exact<{
  data: CreateBillingAdjustmentInput;
}>;


export type RequestBillingAdjustmentMutation = { __typename?: 'Mutation', requestBillingAdjustment: { __typename?: 'BillingAdjustment', id: string, visitId: string, invoiceId?: string | null, visitChargeId?: string | null, appliedOn: AdjustmentAppliedOn, type: AdjustmentType, method: AdjustmentMethod, value?: number | null, amount?: number | null, currency: string, reason: string, status: AdjustmentStatus, requestedByStaffId: string, organizationId: string, notes?: string | null, direction?: AdjustmentDirection | null, reversesAdjustmentId?: string | null } };

export type ApproveBillingAdjustmentMutationVariables = Exact<{
  adjustmentId: Scalars['ID']['input'];
}>;


export type ApproveBillingAdjustmentMutation = { __typename?: 'Mutation', approveBillingAdjustment: { __typename?: 'BillingAdjustment', id: string, status: AdjustmentStatus, approvedByStaffId?: string | null } };

export type RejectBillingAdjustmentMutationVariables = Exact<{
  adjustmentId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type RejectBillingAdjustmentMutation = { __typename?: 'Mutation', rejectBillingAdjustment: { __typename?: 'BillingAdjustment', id: string, status: AdjustmentStatus, notes?: string | null } };

export type ApplyBillingAdjustmentMutationVariables = Exact<{
  adjustmentId: Scalars['ID']['input'];
}>;


export type ApplyBillingAdjustmentMutation = { __typename?: 'Mutation', applyBillingAdjustment: { __typename?: 'BillingAdjustment', id: string, status: AdjustmentStatus, appliedAt?: string | null } };

export type GetVisitInvoiceDetailQueryVariables = Exact<{
  invoiceId: Scalars['ID']['input'];
}>;


export type GetVisitInvoiceDetailQuery = { __typename?: 'Query', visitInvoiceDetail: { __typename?: 'VisitInvoiceDetail', outstandingBalance: number, invoice: { __typename?: 'VisitInvoice', id: string, visitId: string, invoiceNumber: string, status: VisitInvoiceStatus, subtotal: number, discountTotal: number, totalPayable: number, issuedAt?: string | null, lockedAt?: string | null, organizationId: string, visit: { __typename?: 'Visit', id: string, visitType: VisitType, visitDateTime: string, patient: { __typename?: 'Patient', id: string, fullName?: string | null, dateOfBirth?: string | null, gender: string } }, organization: { __typename?: 'Organization', id: string, name: string, email?: string | null, phoneNumber?: string | null, website?: string | null, address?: { __typename?: 'Address', addressLine1: string, city: string, state: string, country: string } | null } }, lineItems: Array<{ __typename?: 'VisitInvoiceLineItem', id: string, invoiceId: string, visitChargeId: string, chargeName: string, quantity: number, unitPrice: number, totalAmount: number, chargeDomain?: ChargeDomain | null, organizationId: string, visitCharge?: { __typename?: 'VisitCharge', id: string, status: VisitChargeStatus } | null }>, adjustmentSnapshots: Array<{ __typename?: 'VisitInvoiceAdjustmentSnapshot', id: string, invoiceId: string, billingAdjustmentId: string, type: AdjustmentType, method: AdjustmentMethod, value?: number | null, amount?: number | null, direction?: AdjustmentDirection | null, resolvedAmount: number, reason: string, organizationId: string, billingAdjustment?: { __typename?: 'BillingAdjustment', id: string, status: AdjustmentStatus } | null }>, payments: Array<{ __typename?: 'VisitPayment', id: string, visitId: string, invoiceId?: string | null, organizationId: string, amountPaid: number, currency: string, paymentMethod: PaymentMethod, status: PaymentStatus, paidAt: string, confirmedAt?: string | null, receivedByStaffId: string, reference?: string | null, notes?: string | null, allocations: Array<{ __typename?: 'VisitPaymentAllocation', id: string, visitChargeId: string, amountAllocated: number, visitCharge: { __typename?: 'VisitCharge', id: string, chargeName: string, totalAmount?: number | null, status: VisitChargeStatus } }> }>, credits: Array<{ __typename?: 'VisitCredit', id: string, visitId: string, visitChargeId?: string | null, amount: number, method: CreditResolutionMethod, status: CreditRefundStatus, reason: string, notes?: string | null, processedByStaffId: string, confirmedAt?: string | null, organizationId: string, visitCharge?: { __typename?: 'VisitCharge', id: string, chargeName: string } | null }>, balancePayments: Array<{ __typename?: 'VisitBalancePayment', id: string, visitId: string, amountPaid: number, paymentMethod: PaymentMethod, status: PaymentStatus, paidAt: string, confirmedAt?: string | null, receivedByStaffId: string, reference?: string | null, reason: string, notes?: string | null, organizationId: string }> } };

export type GetVisitChargeBalancesQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitChargeBalancesQuery = { __typename?: 'Query', visitChargeBalances: Array<{ __typename?: 'VisitChargeBalance', visitChargeId: string, totalAmount: number, effectiveTotal: number, amountPaid: number, remaining: number }> };

export type GetVisitCreditBalanceQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitCreditBalanceQuery = { __typename?: 'Query', visitCreditBalance: number };

export type GetVisitCreditsQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitCreditsQuery = { __typename?: 'Query', visitCredits: Array<{ __typename?: 'VisitCredit', id: string, visitId: string, visitChargeId?: string | null, amount: number, method: CreditResolutionMethod, reason: string, notes?: string | null, status: CreditRefundStatus, processedByStaffId: string, createdAt: string, confirmedAt?: string | null, organizationId: string, visitCharge?: { __typename?: 'VisitCharge', id: string, chargeName: string } | null, visit: { __typename?: 'Visit', id: string, visitType: VisitType, visitDateTime: string, patient: { __typename?: 'Patient', id: string, fullName?: string | null, dateOfBirth?: string | null, gender: string } } }> };

export type CreateVisitCreditRefundMutationVariables = Exact<{
  data: CreateVisitCreditInput;
}>;


export type CreateVisitCreditRefundMutation = { __typename?: 'Mutation', createVisitCreditRefund: { __typename?: 'VisitCredit', id: string, visitId: string, visitChargeId?: string | null, amount: number, method: CreditResolutionMethod, reason: string, notes?: string | null, status: CreditRefundStatus, processedByStaffId: string, createdAt: string, confirmedAt?: string | null, organizationId: string } };

export type ConfirmVisitCreditRefundMutationVariables = Exact<{
  creditId: Scalars['ID']['input'];
}>;


export type ConfirmVisitCreditRefundMutation = { __typename?: 'Mutation', confirmVisitCreditRefund: { __typename?: 'VisitCredit', id: string, status: CreditRefundStatus, confirmedAt?: string | null } };

export type FailVisitCreditRefundMutationVariables = Exact<{
  creditId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type FailVisitCreditRefundMutation = { __typename?: 'Mutation', failVisitCreditRefund: { __typename?: 'VisitCredit', id: string, status: CreditRefundStatus, notes?: string | null } };

export type GetOrganizationFeatureFlagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganizationFeatureFlagsQuery = { __typename?: 'Query', organizationFeatureFlags: Array<{ __typename?: 'FeatureFlagState', flagKey: FeatureFlagKey, enabled: boolean }> };

export type GetOrganizationFeatureFlagHistoryQueryVariables = Exact<{
  flagKey?: InputMaybe<FeatureFlagKey>;
}>;


export type GetOrganizationFeatureFlagHistoryQuery = { __typename?: 'Query', organizationFeatureFlagHistory: Array<{ __typename?: 'OrganizationFeatureFlagEvent', id: string, organizationId: string, flagKey: FeatureFlagKey, enabled: boolean, reason: string, changedByStaffId: string, createdAt: string }> };

export type SetOrganizationFeatureFlagMutationVariables = Exact<{
  flagKey: FeatureFlagKey;
  enabled: Scalars['Boolean']['input'];
  reason: Scalars['String']['input'];
}>;


export type SetOrganizationFeatureFlagMutation = { __typename?: 'Mutation', setOrganizationFeatureFlag: { __typename?: 'OrganizationFeatureFlagEvent', id: string, flagKey: FeatureFlagKey, enabled: boolean, reason: string, changedByStaffId: string, createdAt: string } };

export type GetPatientWalletBalanceQueryVariables = Exact<{
  patientId: Scalars['ID']['input'];
}>;


export type GetPatientWalletBalanceQuery = { __typename?: 'Query', patientWalletBalance: number };

export type GetPatientWalletTransactionsQueryVariables = Exact<{
  patientId: Scalars['ID']['input'];
}>;


export type GetPatientWalletTransactionsQuery = { __typename?: 'Query', patientWalletTransactions: Array<{ __typename?: 'PatientWalletTransaction', id: string, patientId: string, visitId?: string | null, visitCreditId?: string | null, type: WalletTransactionType, amount: number, status: WalletTransactionStatus, reason: string, notes?: string | null, requestedByStaffId: string, approvedByStaffId?: string | null, confirmedAt?: string | null, createdAt: string }> };

export type RequestWalletGrantMutationVariables = Exact<{
  data: RequestWalletGrantInput;
}>;


export type RequestWalletGrantMutation = { __typename?: 'Mutation', requestWalletGrant: { __typename?: 'PatientWalletTransaction', id: string, patientId: string, type: WalletTransactionType, amount: number, status: WalletTransactionStatus, reason: string, notes?: string | null, requestedByStaffId: string, createdAt: string } };

export type ApproveWalletGrantMutationVariables = Exact<{
  transactionId: Scalars['ID']['input'];
}>;


export type ApproveWalletGrantMutation = { __typename?: 'Mutation', approveWalletGrant: { __typename?: 'PatientWalletTransaction', id: string, status: WalletTransactionStatus, approvedByStaffId?: string | null, confirmedAt?: string | null } };

export type RejectWalletGrantMutationVariables = Exact<{
  transactionId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type RejectWalletGrantMutation = { __typename?: 'Mutation', rejectWalletGrant: { __typename?: 'PatientWalletTransaction', id: string, status: WalletTransactionStatus, notes?: string | null } };

export type GetVisitBalancePaymentsQueryVariables = Exact<{
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitBalancePaymentsQuery = { __typename?: 'Query', visitBalancePayments: Array<{ __typename?: 'VisitBalancePayment', id: string, visitId: string, amountPaid: number, paymentMethod: PaymentMethod, status: PaymentStatus, paidAt: string, confirmedAt?: string | null, receivedByStaffId: string, reference?: string | null, reason: string, notes?: string | null, createdAt: string }> };

export type CreateVisitBalancePaymentMutationVariables = Exact<{
  data: CreateVisitBalancePaymentInput;
}>;


export type CreateVisitBalancePaymentMutation = { __typename?: 'Mutation', createVisitBalancePayment: { __typename?: 'VisitBalancePayment', id: string, visitId: string, amountPaid: number, paymentMethod: PaymentMethod, status: PaymentStatus, paidAt: string, reference?: string | null, reason: string, notes?: string | null, createdAt: string } };

export type ConfirmVisitBalancePaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ConfirmVisitBalancePaymentMutation = { __typename?: 'Mutation', confirmVisitBalancePayment: { __typename?: 'VisitBalancePayment', id: string, status: PaymentStatus, confirmedAt?: string | null } };

export type FailVisitBalancePaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type FailVisitBalancePaymentMutation = { __typename?: 'Mutation', failVisitBalancePayment: { __typename?: 'VisitBalancePayment', id: string, status: PaymentStatus, notes?: string | null } };

export type RefundVisitBalancePaymentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type RefundVisitBalancePaymentMutation = { __typename?: 'Mutation', refundVisitBalancePayment: { __typename?: 'VisitBalancePayment', id: string, status: PaymentStatus, notes?: string | null } };

export type GetPatientWalletTransactionsPaginatedQueryVariables = Exact<{
  patientId: Scalars['ID']['input'];
  pagination: PatientWalletTransactionPaginationInput;
}>;


export type GetPatientWalletTransactionsPaginatedQuery = { __typename?: 'Query', patientWalletTransactionsPaginated: { __typename?: 'PatientWalletTransactionPaginationResult', total: number, page: number, pageCount: number, items: Array<{ __typename?: 'PatientWalletTransaction', id: string, patientId: string, visitId?: string | null, visitCreditId?: string | null, type: WalletTransactionType, amount: number, paymentMethod?: PaymentMethod | null, status: WalletTransactionStatus, reason: string, notes?: string | null, requestedByStaffId: string, approvedByStaffId?: string | null, confirmedAt?: string | null, createdAt: string }> } };

export type CreateWalletTopUpMutationVariables = Exact<{
  data: CreateWalletTopUpInput;
}>;


export type CreateWalletTopUpMutation = { __typename?: 'Mutation', createWalletTopUp: { __typename?: 'PatientWalletTransaction', id: string, patientId: string, type: WalletTransactionType, amount: number, paymentMethod?: PaymentMethod | null, status: WalletTransactionStatus, reason: string, notes?: string | null, requestedByStaffId: string, createdAt: string } };

export type ConfirmWalletTopUpMutationVariables = Exact<{
  transactionId: Scalars['ID']['input'];
}>;


export type ConfirmWalletTopUpMutation = { __typename?: 'Mutation', confirmWalletTopUp: { __typename?: 'PatientWalletTransaction', id: string, status: WalletTransactionStatus, confirmedAt?: string | null } };

export type FailWalletTopUpMutationVariables = Exact<{
  transactionId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type FailWalletTopUpMutation = { __typename?: 'Mutation', failWalletTopUp: { __typename?: 'PatientWalletTransaction', id: string, status: WalletTransactionStatus, notes?: string | null } };

export type CloseVisitMutationVariables = Exact<{
  visitId: Scalars['String']['input'];
}>;


export type CloseVisitMutation = { __typename?: 'Mutation', closeVisit: { __typename?: 'Visit', id: string, status: VisitStatus, patient: { __typename?: 'Patient', id: string, fullName?: string | null } } };

export type CloseVisitWithValidationMutationVariables = Exact<{
  visitId: Scalars['String']['input'];
}>;


export type CloseVisitWithValidationMutation = { __typename?: 'Mutation', closeVisitWithValidation: { __typename?: 'Visit', id: string, status: VisitStatus, closedAt?: string | null, patient: { __typename?: 'Patient', id: string, fullName?: string | null, userCode: number }, closedByStaff?: { __typename?: 'Staff', id: string, fullName: string } | null } };

export type GetPatientOutstandingBalanceQueryVariables = Exact<{
  patientId: Scalars['ID']['input'];
}>;


export type GetPatientOutstandingBalanceQuery = { __typename?: 'Query', patientOutstandingBalance: { __typename?: 'PatientOutstandingBalanceResult', patientId: string, patientName: string, patientUserCode?: number | null, totalOutstandingBalance: number, totalChargesAcrossAllVisits: number, totalPaidAcrossAllVisits: number, visitOutstandings: Array<{ __typename?: 'VisitOutstandingBalance', visitId: string, visitDate: string, visitType?: string | null, outstandingBalance: number, totalCharges: number, totalPaid: number, totalAdjustments?: number | null, status: string }> } };

export type GetVisitClosureValidationQueryVariables = Exact<{
  visitId: Scalars['String']['input'];
}>;


export type GetVisitClosureValidationQuery = { __typename?: 'Query', visitClosureValidation: { __typename?: 'VisitClosureValidationResult', canClose: boolean, summary?: string | null, blockingReasons?: Array<string> | null, requirements: Array<{ __typename?: 'VisitClosureRequirement', name: string, met: boolean, message?: string | null, details?: string | null }> } };

export type ReopenVisitMutationVariables = Exact<{
  visitId: Scalars['String']['input'];
}>;


export type ReopenVisitMutation = { __typename?: 'Mutation', reopenVisit: { __typename?: 'Visit', id: string, status: VisitStatus, closedAt?: string | null, closedByStaff?: { __typename?: 'Staff', id: string, fullName: string } | null, patient: { __typename?: 'Patient', id: string, fullName?: string | null } } };

export type CanReconcileVisitQueryVariables = Exact<{
  visitId: Scalars['String']['input'];
}>;


export type CanReconcileVisitQuery = { __typename?: 'Query', canReconcileVisit: { __typename?: 'VisitReconcileResult', canReconcile: boolean, outstandingBalance?: number | null, canClose?: boolean | null, message?: string | null, blockingReasons?: Array<string> | null } };

export type ReconcileVisitMutationVariables = Exact<{
  visitId: Scalars['String']['input'];
}>;


export type ReconcileVisitMutation = { __typename?: 'Mutation', reconcileVisit: { __typename?: 'Visit', id: string, status: VisitStatus, reconciledAt?: string | null, closedAt?: string | null, reconciledByStaff?: { __typename?: 'Staff', id: string, fullName: string } | null, closedByStaff?: { __typename?: 'Staff', id: string, fullName: string } | null, patient: { __typename?: 'Patient', id: string, fullName?: string | null } } };

export type GetVisitBillingPageQueryVariables = Exact<{
  id: Scalars['String']['input'];
  visitId: Scalars['ID']['input'];
}>;


export type GetVisitBillingPageQuery = { __typename?: 'Query', visitCreditBalance: number, visit: { __typename?: 'Visit', id: string, visitType: VisitType, status: VisitStatus, visitDateTime: string, closedAt?: string | null, patientId: string, attendingStaffId?: string | null, patient: { __typename?: 'Patient', id: string, fullName?: string | null, email?: string | null, phoneNumber?: string | null } }, visitChargeSummary: { __typename?: 'VisitChargeSummary', total: number, lockedCharges: Array<{ __typename?: 'VisitCharge', id: string, visitId: string, chargeCatalogId?: string | null, chargeName: string, description?: string | null, quantity: number, unitPrice: number, totalAmount?: number | null, overrideReason?: string | null, status: VisitChargeStatus, chargeType: VisitChargeType, billingType?: BillingType | null, chargeDomain?: ChargeDomain | null, organizationId: string, notes?: string | null, chargeCatalog?: { __typename?: 'ChargeCatalog', id: string, name: string } | null, createdBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }>, editableCharges: Array<{ __typename?: 'VisitCharge', id: string, visitId: string, chargeCatalogId?: string | null, chargeName: string, description?: string | null, quantity: number, unitPrice: number, totalAmount?: number | null, overrideReason?: string | null, status: VisitChargeStatus, chargeType: VisitChargeType, billingType?: BillingType | null, chargeDomain?: ChargeDomain | null, organizationId: string, notes?: string | null, chargeCatalog?: { __typename?: 'ChargeCatalog', id: string, name: string } | null, createdBy: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }> }, unbilledPrescriptions: Array<{ __typename?: 'VisitPrescription', id: string, visitId: string, drug: string, dose?: string | null, route?: string | null, frequency?: string | null, isProvidedInHouse: boolean, startDate?: string | null, endDate?: string | null, notes?: string | null, prescribingDoctorId: string, createdAt: string, updatedAt: string, visitCharge?: { __typename?: 'VisitCharge', id: string } | null, prescribingDoctor: { __typename?: 'Staff', id: string, userCode: number, fullName: string } }>, billingAdjustments: Array<{ __typename?: 'BillingAdjustment', id: string, visitId: string, invoiceId?: string | null, visitChargeId?: string | null, appliedOn: AdjustmentAppliedOn, type: AdjustmentType, method: AdjustmentMethod, value?: number | null, amount?: number | null, currency: string, reason: string, notes?: string | null, status: AdjustmentStatus, direction?: AdjustmentDirection | null, reversesAdjustmentId?: string | null, requestedByStaffId: string, approvedByStaffId?: string | null, appliedAt?: string | null, organizationId: string, reversesAdjustment?: { __typename?: 'BillingAdjustment', id: string, type: AdjustmentType, method: AdjustmentMethod, value?: number | null, amount?: number | null, direction?: AdjustmentDirection | null } | null, chargeLinks?: Array<{ __typename?: 'BillingAdjustmentCharge', id: string, visitCharge: { __typename?: 'VisitCharge', id: string, chargeName: string, totalAmount?: number | null } }> | null }>, latestVisitInvoice?: { __typename?: 'VisitInvoice', id: string, visitId: string, invoiceNumber: string, status: VisitInvoiceStatus, subtotal: number, discountTotal: number, totalPayable: number, totalPaid?: number | null, outstandingBalance?: number | null, issuedAt?: string | null, lockedAt?: string | null, organizationId: string } | null, visitInvoices: Array<{ __typename?: 'VisitInvoice', id: string, visitId: string, invoiceNumber: string, status: VisitInvoiceStatus, subtotal: number, discountTotal: number, totalPayable: number, totalPaid?: number | null, outstandingBalance?: number | null, issuedAt?: string | null, lockedAt?: string | null, organizationId: string }>, visitPayments: Array<{ __typename?: 'VisitPayment', id: string, visitId: string, invoiceId?: string | null, organizationId: string, amountPaid: number, currency: string, paymentMethod: PaymentMethod, status: PaymentStatus, paidAt: string, confirmedAt?: string | null, receivedByStaffId: string, reference?: string | null, notes?: string | null, allocations: Array<{ __typename?: 'VisitPaymentAllocation', id: string, amountAllocated: number, visitCharge: { __typename?: 'VisitCharge', id: string, chargeName: string, totalAmount?: number | null, status: VisitChargeStatus } }> }>, visitCredits: Array<{ __typename?: 'VisitCredit', id: string, visitId: string, amount: number, method: CreditResolutionMethod, reason: string, notes?: string | null, status: CreditRefundStatus, processedByStaffId: string, createdAt: string, confirmedAt?: string | null, organizationId: string, visitChargeId?: string | null, visit: { __typename?: 'Visit', id: string, visitType: VisitType, visitDateTime: string, patient: { __typename?: 'Patient', id: string, fullName?: string | null, dateOfBirth?: string | null, gender: string } }, visitCharge?: { __typename?: 'VisitCharge', id: string, chargeName: string } | null }> };


export const StaffLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StaffLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<StaffLoginMutation, StaffLoginMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const WhoAmIDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WhoAmI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"whoAmI"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"lastLoginAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}}]}}]}}]} as unknown as DocumentNode<WhoAmIQuery, WhoAmIQueryVariables>;
export const GetAllStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffPaginationInput"}}},"defaultValue":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"IntValue","value":"1"}},{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"25"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetAllStaffQuery, GetAllStaffQueryVariables>;
export const GetStaffByRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStaffByRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StaffRole"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffByRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<GetStaffByRoleQuery, GetStaffByRoleQueryVariables>;
export const CreateStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateStaffInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"userType"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<CreateStaffMutation, CreateStaffMutationVariables>;
export const GetStaffByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStaffById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"staffById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetStaffByIdQuery, GetStaffByIdQueryVariables>;
export const UpdateStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]} as unknown as DocumentNode<UpdateStaffMutation, UpdateStaffMutationVariables>;
export const UpdateStaffRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStaffRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffRolesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStaffRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]} as unknown as DocumentNode<UpdateStaffRolesMutation, UpdateStaffRolesMutationVariables>;
export const UpdateStaffStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStaffStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStaffStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<UpdateStaffStatusMutation, UpdateStaffStatusMutationVariables>;
export const UpdateStaffPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStaffPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStaffPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateStaffPasswordMutation, UpdateStaffPasswordMutationVariables>;
export const CreatePatientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePatient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePatientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bloodGroup"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"warning"}},{"kind":"Field","name":{"kind":"Name","value":"matches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePatientMutation, CreatePatientMutationVariables>;
export const GetAllPatientsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPatients"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PatientPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patients"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bloodGroup"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetAllPatientsQuery, GetAllPatientsQueryVariables>;
export const GetPatientByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatientById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"secondaryPhoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"bloodGroup"}},{"kind":"Field","name":{"kind":"Name","value":"allergies"}},{"kind":"Field","name":{"kind":"Name","value":"emergency"}},{"kind":"Field","name":{"kind":"Name","value":"extraDetails"}},{"kind":"Field","name":{"kind":"Name","value":"nextOfKinName"}},{"kind":"Field","name":{"kind":"Name","value":"nextOfKinPhone"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"likelyDuplicatePatientIds"}},{"kind":"Field","name":{"kind":"Name","value":"addresses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]} as unknown as DocumentNode<GetPatientByIdQuery, GetPatientByIdQueryVariables>;
export const UpdatePatientDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePatient"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePatientInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePatient"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}}]}}]} as unknown as DocumentNode<UpdatePatientMutation, UpdatePatientMutationVariables>;
export const CreateVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"patientOutstandingBalance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"patientUserCode"}},{"kind":"Field","name":{"kind":"Name","value":"totalOutstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"totalChargesAcrossAllVisits"}},{"kind":"Field","name":{"kind":"Name","value":"totalPaidAcrossAllVisits"}},{"kind":"Field","name":{"kind":"Name","value":"visitOutstandings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"totalCharges"}},{"kind":"Field","name":{"kind":"Name","value":"totalPaid"}},{"kind":"Field","name":{"kind":"Name","value":"totalAdjustments"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateVisitMutation, CreateVisitMutationVariables>;
export const FindAllVisitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllVisits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisitPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<FindAllVisitsQuery, FindAllVisitsQueryVariables>;
export const GetPatientVisitHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatientVisitHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientVisitHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}}]}}]} as unknown as DocumentNode<GetPatientVisitHistoryQuery, GetPatientVisitHistoryQueryVariables>;
export const GetVisitByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"closedAt"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}}]}}]} as unknown as DocumentNode<GetVisitByIdQuery, GetVisitByIdQueryVariables>;
export const GetGlobalBillingCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGlobalBillingCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"globalBillingCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]}}]} as unknown as DocumentNode<GetGlobalBillingCategoriesQuery, GetGlobalBillingCategoriesQueryVariables>;
export const GetOrganizationBillingCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationBillingCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationBillingCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrganizationBillingCategoriesQuery, GetOrganizationBillingCategoriesQueryVariables>;
export const GetBillingCategoryByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBillingCategoryById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingCategoryById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]}}]} as unknown as DocumentNode<GetBillingCategoryByIdQuery, GetBillingCategoryByIdQueryVariables>;
export const CreateBillingCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBillingCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBillingCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBillingCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<CreateBillingCategoryMutation, CreateBillingCategoryMutationVariables>;
export const UpdateBillingCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBillingCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBillingCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBillingCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<UpdateBillingCategoryMutation, UpdateBillingCategoryMutationVariables>;
export const CreateBillingItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBillingItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBillingItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBillingItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<CreateBillingItemMutation, CreateBillingItemMutationVariables>;
export const CloneGlobalCategoryToOrganizationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CloneGlobalCategoryToOrganization"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cloneGlobalCategoryToOrganization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]}}]} as unknown as DocumentNode<CloneGlobalCategoryToOrganizationMutation, CloneGlobalCategoryToOrganizationMutationVariables>;
export const OrganizationChargeItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationChargeItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationChargeItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<OrganizationChargeItemsQuery, OrganizationChargeItemsQueryVariables>;
export const OrganizationChargeCatalogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OrganizationChargeCatalogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargeCatalogPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationChargeCatalogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"catalogueItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<OrganizationChargeCatalogsQuery, OrganizationChargeCatalogsQueryVariables>;
export const CreateChargeCatalogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChargeCatalog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateChargeCatalogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChargeCatalog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"catalogueItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<CreateChargeCatalogMutation, CreateChargeCatalogMutationVariables>;
export const UpdateChargeCatalogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateChargeCatalog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateChargeCatalogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChargeCatalog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"catalogueItemId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateChargeCatalogMutation, UpdateChargeCatalogMutationVariables>;
export const CreateVisitVitalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitVital"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitVitalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitVital"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"bloodPressure"}},{"kind":"Field","name":{"kind":"Name","value":"heartRate"}},{"kind":"Field","name":{"kind":"Name","value":"respiratoryRate"}},{"kind":"Field","name":{"kind":"Name","value":"spo2"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"bmi"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}}]}}]}}]} as unknown as DocumentNode<CreateVisitVitalMutation, CreateVisitVitalMutationVariables>;
export const UpdateVisitVitalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitVital"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitVitalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitVital"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"bloodPressure"}},{"kind":"Field","name":{"kind":"Name","value":"heartRate"}},{"kind":"Field","name":{"kind":"Name","value":"respiratoryRate"}},{"kind":"Field","name":{"kind":"Name","value":"spo2"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"bmi"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitVitalMutation, UpdateVisitVitalMutationVariables>;
export const VisitVitalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitVitals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitVitals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"temperature"}},{"kind":"Field","name":{"kind":"Name","value":"bloodPressure"}},{"kind":"Field","name":{"kind":"Name","value":"heartRate"}},{"kind":"Field","name":{"kind":"Name","value":"respiratoryRate"}},{"kind":"Field","name":{"kind":"Name","value":"spo2"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"bmi"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}}]}}]}}]} as unknown as DocumentNode<VisitVitalsQuery, VisitVitalsQueryVariables>;
export const ChargeDomainMappingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChargeDomainMappings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeDomainMappings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<ChargeDomainMappingsQuery, ChargeDomainMappingsQueryVariables>;
export const SyncChargeDomainMappingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncChargeDomainMapping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncChargeDomainMappingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncChargeDomainMapping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<SyncChargeDomainMappingMutation, SyncChargeDomainMappingMutationVariables>;
export const GetAuditDistinctValuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditDistinctValues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"field"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditDistinctField"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAuditDistinctValues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"field"},"value":{"kind":"Variable","name":{"kind":"Name","value":"field"}}}]}]}}]} as unknown as DocumentNode<GetAuditDistinctValuesQuery, GetAuditDistinctValuesQueryVariables>;
export const GetAuditLogByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAuditLogById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"actorType"}},{"kind":"Field","name":{"kind":"Name","value":"actorDescription"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"entity"}},{"kind":"Field","name":{"kind":"Name","value":"appName"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogByIdQuery, GetAuditLogByIdQueryVariables>;
export const GetAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"actorType"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"entity"}},{"kind":"Field","name":{"kind":"Name","value":"appName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export const GetActorActivityStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetActorActivityStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"period"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActorActivityPeriod"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActorActivityStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"period"},"value":{"kind":"Variable","name":{"kind":"Name","value":"period"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"buckets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetActorActivityStatsQuery, GetActorActivityStatsQueryVariables>;
export const CatalogsByChargeDomainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CatalogsByChargeDomain"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chargeDomain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargeDomain"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"catalogsByChargeDomain"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"chargeDomain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chargeDomain"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}}]}}]}}]} as unknown as DocumentNode<CatalogsByChargeDomainQuery, CatalogsByChargeDomainQueryVariables>;
export const VisitChargeExistsByDomainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitChargeExistsByDomain"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"chargeDomain"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChargeDomain"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitChargeExistsByDomain"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}},{"kind":"Argument","name":{"kind":"Name","value":"chargeDomain"},"value":{"kind":"Variable","name":{"kind":"Name","value":"chargeDomain"}}}]}]}}]} as unknown as DocumentNode<VisitChargeExistsByDomainQuery, VisitChargeExistsByDomainQueryVariables>;
export const VisitComplaintsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitComplaints"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitComplaints"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"complaint"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VisitComplaintsQuery, VisitComplaintsQueryVariables>;
export const VisitComplaintByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitComplaintById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitComplaintById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"complaint"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VisitComplaintByIdQuery, VisitComplaintByIdQueryVariables>;
export const CreateVisitComplaintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitComplaint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitComplaintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitComplaint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"complaint"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"recordedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateVisitComplaintMutation, CreateVisitComplaintMutationVariables>;
export const CreateVisitChargeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitCharge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitChargeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitCharge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}}]}}]} as unknown as DocumentNode<CreateVisitChargeMutation, CreateVisitChargeMutationVariables>;
export const UpdateVisitChargeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitCharge"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitChargeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitCharge"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitChargeMutation, UpdateVisitChargeMutationVariables>;
export const UpdateVisitComplaintDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitComplaint"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitComplaintInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitComplaint"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"complaint"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitComplaintMutation, UpdateVisitComplaintMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const VisitDiagnosesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitDiagnoses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitDiagnoses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VisitDiagnosesQuery, VisitDiagnosesQueryVariables>;
export const VisitDiagnosisByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VisitDiagnosisById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitDiagnosisById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<VisitDiagnosisByIdQuery, VisitDiagnosisByIdQueryVariables>;
export const CreateVisitDiagnosisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitDiagnosis"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitDiagnosisInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitDiagnosis"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateVisitDiagnosisMutation, CreateVisitDiagnosisMutationVariables>;
export const UpdateVisitDiagnosisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitDiagnosis"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitDiagnosisInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitDiagnosis"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosisCode"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosis"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"diagnosedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitDiagnosisMutation, UpdateVisitDiagnosisMutationVariables>;
export const GetVisitsByPatientUserCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitsByPatientUserCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitsByPatientUserCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"patientNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitsByPatientUserCodeQuery, GetVisitsByPatientUserCodeQueryVariables>;
export const CreateLabRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLabRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLabRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLabRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"requiresConfirmation"}},{"kind":"Field","name":{"kind":"Name","value":"duplicates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateLabRequestMutation, CreateLabRequestMutationVariables>;
export const FindAllLabRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllLabRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LabRequestPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<FindAllLabRequestsQuery, FindAllLabRequestsQueryVariables>;
export const UpdateLabRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLabRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLabRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLabRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"requiresConfirmation"}},{"kind":"Field","name":{"kind":"Name","value":"duplicates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previousRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labRequest"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateLabRequestMutation, UpdateLabRequestMutationVariables>;
export const StartLabRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartLabRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startLabRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"labRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<StartLabRequestMutation, StartLabRequestMutationVariables>;
export const CompleteLabRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteLabRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeLabRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"labRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CompleteLabRequestMutation, CompleteLabRequestMutationVariables>;
export const FindLabRequestsByVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindLabRequestsByVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labRequestsByVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FindLabRequestsByVisitQuery, FindLabRequestsByVisitQueryVariables>;
export const FindLabRequestByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindLabRequestById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labRequestById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindLabRequestByIdQuery, FindLabRequestByIdQueryVariables>;
export const GetLabRequestsByVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLabRequestsByVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labRequestsByVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"tests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}}]}}]}}]}}]} as unknown as DocumentNode<GetLabRequestsByVisitQuery, GetLabRequestsByVisitQueryVariables>;
export const CreateLabResultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLabResult"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLabResultInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLabResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"labRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"performedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parameter"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"referenceRange"}},{"kind":"Field","name":{"kind":"Name","value":"interpretation"}}]}}]}}]}}]} as unknown as DocumentNode<CreateLabResultMutation, CreateLabResultMutationVariables>;
export const LabResultsByLabRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LabResultsByLabRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labResultsByLabRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"labRequestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labRequestId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"labRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"performedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parameter"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"referenceRange"}},{"kind":"Field","name":{"kind":"Name","value":"interpretation"}}]}}]}}]}}]} as unknown as DocumentNode<LabResultsByLabRequestQuery, LabResultsByLabRequestQueryVariables>;
export const UpdateLabResultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLabResult"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLabResultInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLabResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"labRequestId"}},{"kind":"Field","name":{"kind":"Name","value":"testName"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"performedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parameter"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"referenceRange"}},{"kind":"Field","name":{"kind":"Name","value":"interpretation"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateLabResultMutation, UpdateLabResultMutationVariables>;
export const FindVisitPrescriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindVisitPrescriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitPrescriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"drug"}},{"kind":"Field","name":{"kind":"Name","value":"dose"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"isProvidedInHouse"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"prescribingDoctorId"}},{"kind":"Field","name":{"kind":"Name","value":"prescribingDoctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<FindVisitPrescriptionsQuery, FindVisitPrescriptionsQueryVariables>;
export const CreateVisitPrescriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitPrescription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitPrescriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitPrescription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"drug"}},{"kind":"Field","name":{"kind":"Name","value":"dose"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"isProvidedInHouse"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"prescribingDoctorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateVisitPrescriptionMutation, CreateVisitPrescriptionMutationVariables>;
export const UpdateVisitPrescriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitPrescription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitPrescriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitPrescription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"drug"}},{"kind":"Field","name":{"kind":"Name","value":"dose"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"isProvidedInHouse"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"prescribingDoctorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitPrescriptionMutation, UpdateVisitPrescriptionMutationVariables>;
export const GetWardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WardPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"wardClass"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetWardsQuery, GetWardsQueryVariables>;
export const GetWardByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWardById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wardById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"wardClass"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetWardByIdQuery, GetWardByIdQueryVariables>;
export const CreateWardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"wardClass"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateWardMutation, CreateWardMutationVariables>;
export const UpdateWardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWardInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"wardClass"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateWardMutation, UpdateWardMutationVariables>;
export const GetWardIncidentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWardIncidents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WardIncidentPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wardIncidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"ward"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"wardClass"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetWardIncidentsQuery, GetWardIncidentsQueryVariables>;
export const GetWardIncidentsByWardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWardIncidentsByWard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WardIncidentPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wardIncidentsByWard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"ward"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"wardClass"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetWardIncidentsByWardQuery, GetWardIncidentsByWardQueryVariables>;
export const GetWardIncidentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWardIncidentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wardIncidentById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"ward"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"wardClass"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}}]}}]}}]} as unknown as DocumentNode<GetWardIncidentByIdQuery, GetWardIncidentByIdQueryVariables>;
export const CreateWardIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWardIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWardIncidentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWardIncident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"ward"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}}]}}]}}]} as unknown as DocumentNode<CreateWardIncidentMutation, CreateWardIncidentMutationVariables>;
export const UpdateWardIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWardIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWardIncidentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWardIncident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"ward"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateWardIncidentMutation, UpdateWardIncidentMutationVariables>;
export const GetBedsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBeds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BedPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beds"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bedCode"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetBedsQuery, GetBedsQueryVariables>;
export const CreateBedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBedInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bedCode"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateBedMutation, CreateBedMutationVariables>;
export const UpdateBedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBedInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bedCode"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateBedMutation, UpdateBedMutationVariables>;
export const GetVisitProceduresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitProcedures"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisitProcedurePaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitProcedures"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureName"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedureCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bedAllocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bedId"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetVisitProceduresQuery, GetVisitProceduresQueryVariables>;
export const GetVisitProceduresByVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitProceduresByVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitProceduresByVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureName"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"orderedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedureCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bedAllocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitProceduresByVisitQuery, GetVisitProceduresByVisitQueryVariables>;
export const GetVisitProcedureByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitProcedureById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitProcedureById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureName"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}},{"kind":"Field","name":{"kind":"Name","value":"orderedAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedureCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bedAllocation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bedId"}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitProcedureByIdQuery, GetVisitProcedureByIdQueryVariables>;
export const CreateVisitProcedureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitProcedure"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitProcedureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitProcedure"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureName"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"procedureCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateVisitProcedureMutation, CreateVisitProcedureMutationVariables>;
export const UpdateVisitProcedureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitProcedure"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitProcedureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitProcedure"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureName"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitProcedureMutation, UpdateVisitProcedureMutationVariables>;
export const CancelVisitProcedureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelVisitProcedure"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"procedureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cancellationReason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelVisitProcedure"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"procedureId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"procedureId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cancellationReason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cancellationReason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureName"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"procedureCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<CancelVisitProcedureMutation, CancelVisitProcedureMutationVariables>;
export const GetVisitProcedureEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitProcedureEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VisitProcedureEventPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitProcedureEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"procedureId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetVisitProcedureEventsQuery, GetVisitProcedureEventsQueryVariables>;
export const CreateVisitProcedureEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitProcedureEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitProcedureEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitProcedureEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"procedureId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}}]}}]} as unknown as DocumentNode<CreateVisitProcedureEventMutation, CreateVisitProcedureEventMutationVariables>;
export const GetVisitProcedureStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitProcedureStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"procedureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitProcedureStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"procedureId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"procedureId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"staffName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"functionInProcedure"}}]}}]}}]} as unknown as DocumentNode<GetVisitProcedureStaffQuery, GetVisitProcedureStaffQueryVariables>;
export const BulkAssignVisitProcedureStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BulkAssignVisitProcedureStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BulkAssignProcedureStaffInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkAssignVisitProcedureStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"staffName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"functionInProcedure"}}]}}]}}]} as unknown as DocumentNode<BulkAssignVisitProcedureStaffMutation, BulkAssignVisitProcedureStaffMutationVariables>;
export const UpdateVisitProcedureStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitProcedureStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProcedureStaffInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitProcedureStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"staffName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"functionInProcedure"}}]}}]}}]} as unknown as DocumentNode<UpdateVisitProcedureStaffMutation, UpdateVisitProcedureStaffMutationVariables>;
export const GetTheatresDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTheatres"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TheatrePaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theatres"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetTheatresQuery, GetTheatresQueryVariables>;
export const GetTheatreByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTheatreById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theatreById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<GetTheatreByIdQuery, GetTheatreByIdQueryVariables>;
export const CreateTheatreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTheatre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTheatreInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTheatre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<CreateTheatreMutation, CreateTheatreMutationVariables>;
export const UpdateTheatreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTheatre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTheatreInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTheatre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<UpdateTheatreMutation, UpdateTheatreMutationVariables>;
export const GetTheatreIncidentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTheatreIncidents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TheatreIncidentPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theatreIncidents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetTheatreIncidentsQuery, GetTheatreIncidentsQueryVariables>;
export const GetTheatreIncidentsByTheatreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTheatreIncidentsByTheatre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"theatreId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TheatreIncidentPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theatreIncidentsByTheatre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"theatreId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"theatreId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetTheatreIncidentsByTheatreQuery, GetTheatreIncidentsByTheatreQueryVariables>;
export const GetTheatreIncidentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTheatreIncidentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theatreIncidentById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}}]}}]}}]} as unknown as DocumentNode<GetTheatreIncidentByIdQuery, GetTheatreIncidentByIdQueryVariables>;
export const CreateTheatreIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTheatreIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTheatreIncidentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTheatreIncident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTheatreIncidentMutation, CreateTheatreIncidentMutationVariables>;
export const UpdateTheatreIncidentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTheatreIncident"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTheatreIncidentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTheatreIncident"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reportedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reportedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTheatreIncidentMutation, UpdateTheatreIncidentMutationVariables>;
export const AvailableTheatresForTimeRangeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AvailableTheatresForTimeRange"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AvailableTheatrePaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableTheatresForTimeRange"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<AvailableTheatresForTimeRangeQuery, AvailableTheatresForTimeRangeQueryVariables>;
export const TheatreScheduleForDayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TheatreScheduleForDay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"theatreId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theatreScheduleForDay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"theatreId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"theatreId"}}},{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"floor"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"computedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"availability"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureName"}},{"kind":"Field","name":{"kind":"Name","value":"customProcedureCode"}},{"kind":"Field","name":{"kind":"Name","value":"procedureCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<TheatreScheduleForDayQuery, TheatreScheduleForDayQueryVariables>;
export const ActiveBlocksForTheatreDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActiveBlocksForTheatre"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"theatreId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeBlocksForTheatre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"theatreId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"theatreId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<ActiveBlocksForTheatreQuery, ActiveBlocksForTheatreQueryVariables>;
export const TheatreAvailabilitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TheatreAvailabilities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"theatreId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"theatreAvailabilities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"theatreId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"theatreId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}}]}}]}}]} as unknown as DocumentNode<TheatreAvailabilitiesQuery, TheatreAvailabilitiesQueryVariables>;
export const SyncTheatreAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncTheatreAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncTheatreAvailabilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncTheatreAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}}]}}]}}]} as unknown as DocumentNode<SyncTheatreAvailabilityMutation, SyncTheatreAvailabilityMutationVariables>;
export const CreateTheatreBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTheatreBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTheatreBlockInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTheatreBlock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTheatreBlockMutation, CreateTheatreBlockMutationVariables>;
export const UpdateTheatreBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTheatreBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTheatreBlockInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTheatreBlock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTheatreBlockMutation, UpdateTheatreBlockMutationVariables>;
export const ResolveTheatreBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResolveTheatreBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResolveTheatreBlockInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resolveTheatreBlock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<ResolveTheatreBlockMutation, ResolveTheatreBlockMutationVariables>;
export const CreateTheatreBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTheatreBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTheatreBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTheatreBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"procedureId"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"actualDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"bookedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"delayReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTheatreBookingMutation, CreateTheatreBookingMutationVariables>;
export const UpdateTheatreBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTheatreBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTheatreBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTheatreBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"procedureId"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"actualDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"bookedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"delayReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTheatreBookingMutation, UpdateTheatreBookingMutationVariables>;
export const CancelTheatreBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelTheatreBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelTheatreBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelTheatreBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CancelTheatreBookingMutation, CancelTheatreBookingMutationVariables>;
export const ReallocateTheatreBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReallocateTheatreBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReallocateTheatreBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reallocateTheatreBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<ReallocateTheatreBookingMutation, ReallocateTheatreBookingMutationVariables>;
export const DelayTheatreBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DelayTheatreBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DelayTheatreBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delayTheatreBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"delayReason"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DelayTheatreBookingMutation, DelayTheatreBookingMutationVariables>;
export const StartTheatreProcedureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartTheatreProcedure"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartTheatreProcedureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startTheatreProcedure"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<StartTheatreProcedureMutation, StartTheatreProcedureMutationVariables>;
export const CompleteTheatreProcedureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CompleteTheatreProcedure"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompleteTheatreProcedureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"completeTheatreProcedure"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CompleteTheatreProcedureMutation, CompleteTheatreProcedureMutationVariables>;
export const AbortTheatreBookingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AbortTheatreBooking"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelTheatreBookingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"abortTheatreBooking"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AbortTheatreBookingMutation, AbortTheatreBookingMutationVariables>;
export const GetProcedureTheatreBookingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProcedureTheatreBookings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"procedureId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProcedureTheatreBookings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"procedureId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"procedureId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theatreId"}},{"kind":"Field","name":{"kind":"Name","value":"procedureId"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualStartTime"}},{"kind":"Field","name":{"kind":"Name","value":"actualEndTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"actualDurationMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"bookedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"delayReason"}},{"kind":"Field","name":{"kind":"Name","value":"cancellationReason"}},{"kind":"Field","name":{"kind":"Name","value":"theatre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"procedure"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProcedureTheatreBookingsQuery, GetProcedureTheatreBookingsQueryVariables>;
export const FindBedAllocationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindBedAllocationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bedAllocationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"bedId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"releasedAt"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"releasedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"bed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bedCode"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allocatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"releasedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<FindBedAllocationByIdQuery, FindBedAllocationByIdQueryVariables>;
export const GetBedAllocationsByVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBedAllocationsByVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bedAllocationsByVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"bedId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"releasedAt"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"releasedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"bed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bedCode"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allocatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"releasedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<GetBedAllocationsByVisitQuery, GetBedAllocationsByVisitQueryVariables>;
export const GetBedAllocationsByWardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBedAllocationsByWard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitBedAllocationsByWard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wardId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"bedId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"releasedAt"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"releasedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"bed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"wardId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bedCode"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"allocatedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"releasedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<GetBedAllocationsByWardQuery, GetBedAllocationsByWardQueryVariables>;
export const CreateBedAllocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBedAllocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitBedAllocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBedAllocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"bedId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"bed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bedCode"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBedAllocationMutation, CreateBedAllocationMutationVariables>;
export const UpdateBedAllocationStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBedAllocationStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitBedAllocationStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBedAllocationStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"bedId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"releasedAt"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"releasedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"bed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bedCode"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateBedAllocationStatusMutation, UpdateBedAllocationStatusMutationVariables>;
export const TransferBedAllocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransferBedAllocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TransferVisitBedAllocationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferBedAllocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"bedId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"allocatedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"bed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bedCode"}},{"kind":"Field","name":{"kind":"Name","value":"class"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<TransferBedAllocationMutation, TransferBedAllocationMutationVariables>;
export const GetVisitNotesByVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitNotesByVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitNotesByVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"authorStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitNotesByVisitQuery, GetVisitNotesByVisitQueryVariables>;
export const CreateVisitNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"authorStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<CreateVisitNoteMutation, CreateVisitNoteMutationVariables>;
export const UpdateVisitNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"authorStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateVisitNoteMutation, UpdateVisitNoteMutationVariables>;
export const GetVisitNotePositionsByVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitNotePositionsByVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitNotePositionsByVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}}]}}]}}]} as unknown as DocumentNode<GetVisitNotePositionsByVisitQuery, GetVisitNotePositionsByVisitQueryVariables>;
export const UpsertVisitNotePositionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertVisitNotePosition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertVisitNotePositionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertVisitNotePosition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"positionX"}},{"kind":"Field","name":{"kind":"Name","value":"positionY"}},{"kind":"Field","name":{"kind":"Name","value":"zIndex"}}]}}]}}]} as unknown as DocumentNode<UpsertVisitNotePositionMutation, UpsertVisitNotePositionMutationVariables>;
export const GetVisitTasksByVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitTasksByVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitTasksByVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"taskType"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"completedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitTasksByVisitQuery, GetVisitTasksByVisitQueryVariables>;
export const CreateVisitTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitTaskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"taskType"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<CreateVisitTaskMutation, CreateVisitTaskMutationVariables>;
export const UpdateVisitTaskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitTask"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitTaskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitTask"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"taskType"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"createdByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateVisitTaskMutation, UpdateVisitTaskMutationVariables>;
export const UpdateVisitTaskStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVisitTaskStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVisitTaskStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateVisitTaskStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"taskType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"isEmailSent"}},{"kind":"Field","name":{"kind":"Name","value":"completedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateVisitTaskStatusMutation, UpdateVisitTaskStatusMutationVariables>;
export const ChangeStaffPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeStaffPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStaffPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeStaffPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<ChangeStaffPasswordMutation, ChangeStaffPasswordMutationVariables>;
export const GetVisitChargeSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitChargeSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitChargeSummary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"lockedCharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"overrideReason"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"chargeType"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"editableCharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"overrideReason"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"chargeType"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitChargeSummaryQuery, GetVisitChargeSummaryQueryVariables>;
export const GetVisitChargeTotalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitChargeTotal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitChargeTotal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}]}]}}]} as unknown as DocumentNode<GetVisitChargeTotalQuery, GetVisitChargeTotalQueryVariables>;
export const GetUnbilledPrescriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUnbilledPrescriptions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unbilledPrescriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"drug"}},{"kind":"Field","name":{"kind":"Name","value":"dose"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"isProvidedInHouse"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"prescribingDoctorId"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"prescribingDoctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<GetUnbilledPrescriptionsQuery, GetUnbilledPrescriptionsQueryVariables>;
export const CreateChargeFromPrescriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChargeFromPrescription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prescriptionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unitPrice"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChargeFromPrescription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"prescriptionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prescriptionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"unitPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unitPrice"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"chargeType"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<CreateChargeFromPrescriptionMutation, CreateChargeFromPrescriptionMutationVariables>;
export const GetLatestVisitInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLatestVisitInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestVisitInvoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"discountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalPayable"}},{"kind":"Field","name":{"kind":"Name","value":"totalPaid"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"issuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lockedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<GetLatestVisitInvoiceQuery, GetLatestVisitInvoiceQueryVariables>;
export const GetVisitInvoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitInvoices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitInvoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"discountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalPayable"}},{"kind":"Field","name":{"kind":"Name","value":"totalPaid"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"issuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lockedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<GetVisitInvoicesQuery, GetVisitInvoicesQueryVariables>;
export const GenerateVisitInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateVisitInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateVisitInvoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"discountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalPayable"}},{"kind":"Field","name":{"kind":"Name","value":"issuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lockedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<GenerateVisitInvoiceMutation, GenerateVisitInvoiceMutationVariables>;
export const IssueVisitInvoiceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"IssueVisitInvoice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoiceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"issueVisitInvoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invoiceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoiceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"discountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalPayable"}},{"kind":"Field","name":{"kind":"Name","value":"issuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lockedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<IssueVisitInvoiceMutation, IssueVisitInvoiceMutationVariables>;
export const GetVisitCurrentTotalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitCurrentTotals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitCurrentTotals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"discountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"surchargeTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalPayable"}},{"kind":"Field","name":{"kind":"Name","value":"totalPaid"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingBalance"}}]}}]}}]} as unknown as DocumentNode<GetVisitCurrentTotalsQuery, GetVisitCurrentTotalsQueryVariables>;
export const GetVisitPaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitPayments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitPayments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"receivedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"allocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"amountAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitPaymentsQuery, GetVisitPaymentsQueryVariables>;
export const CreateVisitPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitPaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"receivedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"allocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"amountAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateVisitPaymentMutation, CreateVisitPaymentMutationVariables>;
export const ConfirmVisitPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmVisitPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmVisitPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paymentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}}]}}]}}]} as unknown as DocumentNode<ConfirmVisitPaymentMutation, ConfirmVisitPaymentMutationVariables>;
export const FailVisitPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FailVisitPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"failVisitPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paymentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<FailVisitPaymentMutation, FailVisitPaymentMutationVariables>;
export const RefundVisitPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefundVisitPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refundVisitPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paymentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paymentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<RefundVisitPaymentMutation, RefundVisitPaymentMutationVariables>;
export const GetBillingAdjustmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBillingAdjustments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billingAdjustments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"appliedOn"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"reversesAdjustmentId"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"appliedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reversesAdjustment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chargeLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetBillingAdjustmentsQuery, GetBillingAdjustmentsQueryVariables>;
export const RequestBillingAdjustmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestBillingAdjustment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBillingAdjustmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestBillingAdjustment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"appliedOn"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"reversesAdjustmentId"}}]}}]}}]} as unknown as DocumentNode<RequestBillingAdjustmentMutation, RequestBillingAdjustmentMutationVariables>;
export const ApproveBillingAdjustmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveBillingAdjustment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"adjustmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveBillingAdjustment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"adjustmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"adjustmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByStaffId"}}]}}]}}]} as unknown as DocumentNode<ApproveBillingAdjustmentMutation, ApproveBillingAdjustmentMutationVariables>;
export const RejectBillingAdjustmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectBillingAdjustment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"adjustmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectBillingAdjustment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"adjustmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"adjustmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<RejectBillingAdjustmentMutation, RejectBillingAdjustmentMutationVariables>;
export const ApplyBillingAdjustmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyBillingAdjustment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"adjustmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyBillingAdjustment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"adjustmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"adjustmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"appliedAt"}}]}}]}}]} as unknown as DocumentNode<ApplyBillingAdjustmentMutation, ApplyBillingAdjustmentMutationVariables>;
export const GetVisitInvoiceDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitInvoiceDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"invoiceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitInvoiceDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"invoiceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"invoiceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"outstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"invoice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"discountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalPayable"}},{"kind":"Field","name":{"kind":"Name","value":"issuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lockedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressLine1"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"country"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lineItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"adjustmentSnapshots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"billingAdjustmentId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"resolvedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"billingAdjustment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"payments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"receivedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"allocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"amountAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"processedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"balancePayments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"receivedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitInvoiceDetailQuery, GetVisitInvoiceDetailQueryVariables>;
export const GetVisitChargeBalancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitChargeBalances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitChargeBalances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveTotal"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"remaining"}}]}}]}}]} as unknown as DocumentNode<GetVisitChargeBalancesQuery, GetVisitChargeBalancesQueryVariables>;
export const GetVisitCreditBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitCreditBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitCreditBalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}]}]}}]} as unknown as DocumentNode<GetVisitCreditBalanceQuery, GetVisitCreditBalanceQueryVariables>;
export const GetVisitCreditsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitCredits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitCredits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<GetVisitCreditsQuery, GetVisitCreditsQueryVariables>;
export const CreateVisitCreditRefundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitCreditRefund"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitCreditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitCreditRefund"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}}]}}]} as unknown as DocumentNode<CreateVisitCreditRefundMutation, CreateVisitCreditRefundMutationVariables>;
export const ConfirmVisitCreditRefundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmVisitCreditRefund"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creditId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmVisitCreditRefund"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"creditId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creditId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}}]}}]}}]} as unknown as DocumentNode<ConfirmVisitCreditRefundMutation, ConfirmVisitCreditRefundMutationVariables>;
export const FailVisitCreditRefundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FailVisitCreditRefund"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"creditId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"failVisitCreditRefund"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"creditId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"creditId"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<FailVisitCreditRefundMutation, FailVisitCreditRefundMutationVariables>;
export const GetOrganizationFeatureFlagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationFeatureFlags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationFeatureFlags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"flagKey"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationFeatureFlagsQuery, GetOrganizationFeatureFlagsQueryVariables>;
export const GetOrganizationFeatureFlagHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationFeatureFlagHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"flagKey"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureFlagKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationFeatureFlagHistory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"flagKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"flagKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"flagKey"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"changedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetOrganizationFeatureFlagHistoryQuery, GetOrganizationFeatureFlagHistoryQueryVariables>;
export const SetOrganizationFeatureFlagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetOrganizationFeatureFlag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"flagKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FeatureFlagKey"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setOrganizationFeatureFlag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"flagKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"flagKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"enabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"flagKey"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"changedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<SetOrganizationFeatureFlagMutation, SetOrganizationFeatureFlagMutationVariables>;
export const GetPatientWalletBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatientWalletBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientWalletBalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}]}]}}]} as unknown as DocumentNode<GetPatientWalletBalanceQuery, GetPatientWalletBalanceQueryVariables>;
export const GetPatientWalletTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatientWalletTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientWalletTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"visitCreditId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetPatientWalletTransactionsQuery, GetPatientWalletTransactionsQueryVariables>;
export const RequestWalletGrantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestWalletGrant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestWalletGrantInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestWalletGrant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<RequestWalletGrantMutation, RequestWalletGrantMutationVariables>;
export const ApproveWalletGrantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApproveWalletGrant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"approveWalletGrant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}}]}}]}}]} as unknown as DocumentNode<ApproveWalletGrantMutation, ApproveWalletGrantMutationVariables>;
export const RejectWalletGrantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectWalletGrant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectWalletGrant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<RejectWalletGrantMutation, RejectWalletGrantMutationVariables>;
export const GetVisitBalancePaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitBalancePayments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitBalancePayments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"receivedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetVisitBalancePaymentsQuery, GetVisitBalancePaymentsQueryVariables>;
export const CreateVisitBalancePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVisitBalancePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVisitBalancePaymentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVisitBalancePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateVisitBalancePaymentMutation, CreateVisitBalancePaymentMutationVariables>;
export const ConfirmVisitBalancePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmVisitBalancePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmVisitBalancePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}}]}}]}}]} as unknown as DocumentNode<ConfirmVisitBalancePaymentMutation, ConfirmVisitBalancePaymentMutationVariables>;
export const FailVisitBalancePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FailVisitBalancePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"failVisitBalancePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<FailVisitBalancePaymentMutation, FailVisitBalancePaymentMutationVariables>;
export const RefundVisitBalancePaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefundVisitBalancePayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refundVisitBalancePayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<RefundVisitBalancePaymentMutation, RefundVisitBalancePaymentMutationVariables>;
export const GetPatientWalletTransactionsPaginatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatientWalletTransactionsPaginated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PatientWalletTransactionPaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientWalletTransactionsPaginated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"visitCreditId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageCount"}}]}}]}}]} as unknown as DocumentNode<GetPatientWalletTransactionsPaginatedQuery, GetPatientWalletTransactionsPaginatedQueryVariables>;
export const CreateWalletTopUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWalletTopUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWalletTopUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWalletTopUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateWalletTopUpMutation, CreateWalletTopUpMutationVariables>;
export const ConfirmWalletTopUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmWalletTopUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmWalletTopUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}}]}}]}}]} as unknown as DocumentNode<ConfirmWalletTopUpMutation, ConfirmWalletTopUpMutationVariables>;
export const FailWalletTopUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FailWalletTopUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reason"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"failWalletTopUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"transactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"transactionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"reason"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reason"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<FailWalletTopUpMutation, FailWalletTopUpMutationVariables>;
export const CloseVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CloseVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closeVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<CloseVisitMutation, CloseVisitMutationVariables>;
export const CloseVisitWithValidationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CloseVisitWithValidation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closeVisitWithValidation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"closedAt"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"closedByStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<CloseVisitWithValidationMutation, CloseVisitWithValidationMutationVariables>;
export const GetPatientOutstandingBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPatientOutstandingBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientOutstandingBalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"patientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patientId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"patientName"}},{"kind":"Field","name":{"kind":"Name","value":"patientUserCode"}},{"kind":"Field","name":{"kind":"Name","value":"totalOutstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"totalChargesAcrossAllVisits"}},{"kind":"Field","name":{"kind":"Name","value":"totalPaidAcrossAllVisits"}},{"kind":"Field","name":{"kind":"Name","value":"visitOutstandings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"visitDate"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"totalCharges"}},{"kind":"Field","name":{"kind":"Name","value":"totalPaid"}},{"kind":"Field","name":{"kind":"Name","value":"totalAdjustments"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<GetPatientOutstandingBalanceQuery, GetPatientOutstandingBalanceQueryVariables>;
export const GetVisitClosureValidationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitClosureValidation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitClosureValidation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canClose"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"blockingReasons"}},{"kind":"Field","name":{"kind":"Name","value":"requirements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"met"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"details"}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitClosureValidationQuery, GetVisitClosureValidationQueryVariables>;
export const ReopenVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReopenVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reopenVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"closedAt"}},{"kind":"Field","name":{"kind":"Name","value":"closedByStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<ReopenVisitMutation, ReopenVisitMutationVariables>;
export const CanReconcileVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CanReconcileVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canReconcileVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canReconcile"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"canClose"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"blockingReasons"}}]}}]}}]} as unknown as DocumentNode<CanReconcileVisitQuery, CanReconcileVisitQueryVariables>;
export const ReconcileVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReconcileVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reconcileVisit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reconciledAt"}},{"kind":"Field","name":{"kind":"Name","value":"reconciledByStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"closedAt"}},{"kind":"Field","name":{"kind":"Name","value":"closedByStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode<ReconcileVisitMutation, ReconcileVisitMutationVariables>;
export const GetVisitBillingPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVisitBillingPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"closedAt"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"Field","name":{"kind":"Name","value":"patientId"}},{"kind":"Field","name":{"kind":"Name","value":"attendingStaffId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeSummary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"lockedCharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"overrideReason"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"chargeType"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"editableCharges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalogId"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"overrideReason"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"chargeType"}},{"kind":"Field","name":{"kind":"Name","value":"billingType"}},{"kind":"Field","name":{"kind":"Name","value":"chargeDomain"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"chargeCatalog"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"unbilledPrescriptions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"drug"}},{"kind":"Field","name":{"kind":"Name","value":"dose"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"isProvidedInHouse"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"prescribingDoctorId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prescribingDoctor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userCode"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"billingAdjustments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}},{"kind":"Field","name":{"kind":"Name","value":"appliedOn"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"reversesAdjustmentId"}},{"kind":"Field","name":{"kind":"Name","value":"requestedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"approvedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"appliedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"reversesAdjustment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chargeLinks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestVisitInvoice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"discountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalPayable"}},{"kind":"Field","name":{"kind":"Name","value":"totalPaid"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"issuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lockedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitInvoices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"discountTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalPayable"}},{"kind":"Field","name":{"kind":"Name","value":"totalPaid"}},{"kind":"Field","name":{"kind":"Name","value":"outstandingBalance"}},{"kind":"Field","name":{"kind":"Name","value":"issuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lockedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitPayments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceId"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"amountPaid"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"paymentMethod"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"paidAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"receivedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"allocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amountAllocated"}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitCredits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"method"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"processedByStaffId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"confirmedAt"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"visit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitType"}},{"kind":"Field","name":{"kind":"Name","value":"visitDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"patient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitCharge"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chargeName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitChargeId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitCreditBalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"visitId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}}]}]}}]} as unknown as DocumentNode<GetVisitBillingPageQuery, GetVisitBillingPageQueryVariables>;