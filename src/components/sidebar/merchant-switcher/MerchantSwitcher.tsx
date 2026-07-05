import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@mms/shared';
import type { MerchantListItem } from '@mms/shared/features/merchants';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  Phone,
  Store,
  Users2,
} from 'lucide-react';
import * as React from 'react';

import {
  ALL_MERCHANTS,
  useSelectedMerchant,
} from '@/contexts/SelectedMerchantContext';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from '@/components/sidebar/index';

export interface MerchantSwitcherProps {
  /** @deprecated no longer used; kept for API compatibility */
  logoSrc?: string;
  /** @deprecated no longer used; kept for API compatibility */
  collapsedLogoSrc?: string;
  /** @deprecated no longer used; kept for API compatibility */
  logoAlt?: string;
}

function getMerchantStatusNotice(status?: string) {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'approved-individual':
      return undefined;
    case 'submitted':
      return 'Your KYB application has been submitted and is pending review.';
    case 'checked':
      return 'Your KYB application is being reviewed. We will notify you once it is processed.';
    case 'need-revision':
      return 'Your KYB application requires revisions. Please update the requested information.';
    default:
      return 'Your KYB application is pending review. We will notify you once it is processed.';
  }
}

function MerchantDetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function ActiveMerchantCard({
  merchant,
}: {
  merchant?: MerchantListItem;
}) {
  if (!merchant) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
            <Store className="size-6 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">All merchants</p>
            <p className="text-xs text-muted-foreground">
              Select a merchant from the list to lock it for all features
            </p>
          </div>
        </div>
      </div>
    );
  }

  const notice = getMerchantStatusNotice(merchant.status);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted">
          <Store className="size-6 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">
            {merchant.name}
            {merchant.status && (
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                ({merchant.status})
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {merchant.categoryName ?? 'Merchant'} · MIM-MER-{merchant.merchantId}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <MerchantDetailItem
          icon={Phone}
          label="Phone"
          value={merchant.mobile}
        />
        <MerchantDetailItem
          icon={Mail}
          label="Email"
          value={merchant.email}
        />
      </div>

      {notice && (
        <p className="rounded-md bg-destructive/10 p-2 text-xs font-medium text-destructive">
          {notice}
        </p>
      )}
    </div>
  );
}

interface MerchantListProps {
  onSelect: (merchantId: string | typeof ALL_MERCHANTS) => void;
}

function MerchantList({ onSelect }: MerchantListProps) {
  const { merchants, isLoadingMerchants, selectedMerchantId } =
    useSelectedMerchant();

  return (
    <div className="w-72 max-w-[calc(100vw-2rem)] rounded-lg border bg-card p-2 shadow-lg">
      <div className="mb-1 px-2 py-1">
        <p className="text-sm font-semibold">Switch merchants</p>
      </div>

      <button
        type="button"
        onClick={() => onSelect(ALL_MERCHANTS)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-accent"
      >
        <div className="flex size-8 items-center justify-center rounded-sm border">
          <Users2 className="size-4 shrink-0" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">All merchants</p>
          <p className="truncate text-xs text-muted-foreground">
            Select per feature
          </p>
        </div>
        {selectedMerchantId === ALL_MERCHANTS && (
          <Check className="size-4 shrink-0" />
        )}
      </button>

      <Separator className="my-2" />

      {isLoadingMerchants && (
        <div className="space-y-2 px-2 py-2">
          <SidebarMenuSkeleton showIcon />
          <SidebarMenuSkeleton showIcon />
        </div>
      )}

      {!isLoadingMerchants && merchants.length === 0 && (
        <p className="px-2 py-3 text-center text-xs text-muted-foreground">
          No merchants available
        </p>
      )}

      {merchants.map((merchant) => {
        const merchantId = String(merchant.merchantId);
        const isActive = selectedMerchantId === merchantId;

        return (
          <button
            key={merchantId}
            type="button"
            onClick={() => onSelect(merchantId)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-accent"
          >
            <div className="flex size-8 items-center justify-center rounded-sm border">
              <Store className="size-4 shrink-0" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{merchant.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {merchant.email ?? `MIM-MER-${merchant.merchantId}`}
              </p>
            </div>
            {isActive && <Check className="size-4 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

export function MerchantSwitcher(_props: MerchantSwitcherProps) {
  const { isMobile } = useSidebar();
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [listOpen, setListOpen] = React.useState(false);
  const {
    merchants,
    isLoadingMerchants,
    selectedMerchantId,
    setSelectedMerchantId,
  } = useSelectedMerchant();

  const activeMerchant = React.useMemo(
    () =>
      selectedMerchantId === ALL_MERCHANTS
        ? undefined
        : merchants.find(
            (merchant) => String(merchant.merchantId) === selectedMerchantId,
          ),
    [merchants, selectedMerchantId],
  );

  const activeLabel = activeMerchant?.name ?? 'All merchants';

  const handleSelect = (merchantId: string | typeof ALL_MERCHANTS) => {
    setSelectedMerchantId(merchantId);
    setListOpen(false);
    setDetailsOpen(false);
  };

  if (isLoadingMerchants) {
    return (
      <SidebarMenu className="mx-1">
        <SidebarMenuItem>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu className="mx-1">
      <SidebarMenuItem>
        <Popover open={detailsOpen} onOpenChange={setDetailsOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-10 shrink-0 items-center justify-center border rounded-md group-data-[collapsible=icon]:size-7">
                <Store className="size-6 group-data-[collapsible=icon]:size-3.5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{activeLabel}</span>
                <span className="truncate text-xs">Switch merchants</span>
              </div>
              <ChevronDown className="ml-auto group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 overflow-hidden rounded-lg border bg-card p-0 shadow-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={8}
          >
            <ActiveMerchantCard merchant={activeMerchant} />

            <Separator />

            <Popover open={listOpen} onOpenChange={setListOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-accent"
                >
                  <span className="flex items-center gap-2">
                    <Users2 className="size-4" />
                    Switch merchants
                  </span>
                  <ArrowRight className="size-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="border-0 bg-transparent p-0 shadow-none"
                align="start"
                side={isMobile ? 'bottom' : 'right'}
                sideOffset={8}
              >
                <MerchantList onSelect={handleSelect} />
              </PopoverContent>
            </Popover>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default MerchantSwitcher;
