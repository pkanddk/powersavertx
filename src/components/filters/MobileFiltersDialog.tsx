import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilterSelect } from "./FilterSelect";
import { SlidersHorizontal } from "lucide-react";
import { Plan } from "@/lib/api";
import { 
  sortOptions, 
  contractLengthOptions, 
  planTypeOptions,
  prepaidOptions,
  timeOfUseOptions,
  renewableOptions,
  cancellationFeeOptions 
} from "./filterOptions";
import { handleCancellationFeeChange, getCurrentCancellationFeeValue } from "./utils/cancellationFeeUtils";
import { getCompanyOptions } from "./CompanyOptions";

interface MobileFiltersDialogProps {
  onSortChange: (value: string) => void;
  onContractLengthChange: (value: string) => void;
  onPlanTypeChange: (value: string) => void;
  onPrepaidChange: (value: string) => void;
  onTimeOfUseChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onRenewableChange: (value: string) => void;
  onCancellationFeeChange: (value: [number, number]) => void;
  currentSort: string;
  currentContractLength: string;
  currentPlanType: string;
  currentPrepaid: string;
  currentTimeOfUse: string;
  currentCompany: string;
  currentRenewable: string;
  currentCancellationFee: [number, number];
  plans?: Plan[];
}

export function MobileFiltersDialog(props: MobileFiltersDialogProps) {
  const companyOptions = getCompanyOptions(props.plans);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="default"
          className="md:hidden w-full h-10 mt-4 md:mt-0"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle>Filter Plans</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FilterSelect
            label="Sort by Price"
            value={props.currentSort}
            onValueChange={props.onSortChange}
            options={sortOptions}
          />
          <FilterSelect
            label="Contract Length"
            value={props.currentContractLength}
            onValueChange={props.onContractLengthChange}
            options={contractLengthOptions}
          />
          <FilterSelect
            label="Plan Type"
            value={props.currentPlanType}
            onValueChange={props.onPlanTypeChange}
            options={planTypeOptions}
          />
          <FilterSelect
            label="Company"
            value={props.currentCompany}
            onValueChange={props.onCompanyChange}
            options={companyOptions}
          />
          <FilterSelect
            label="Prepaid Plans"
            value={props.currentPrepaid}
            onValueChange={props.onPrepaidChange}
            options={prepaidOptions}
          />
          <FilterSelect
            label="Time of Use"
            value={props.currentTimeOfUse}
            onValueChange={props.onTimeOfUseChange}
            options={timeOfUseOptions}
          />
          <FilterSelect
            label="Renewable Energy"
            value={props.currentRenewable}
            onValueChange={props.onRenewableChange}
            options={renewableOptions}
          />
          <FilterSelect
            label="Cancellation Fee"
            value={getCurrentCancellationFeeValue(props.currentCancellationFee)}
            onValueChange={(value) => props.onCancellationFeeChange(handleCancellationFeeChange(value))}
            options={cancellationFeeOptions}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}