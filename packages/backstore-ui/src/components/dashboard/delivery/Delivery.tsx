import React, { useEffect } from "react";
import { Spin, Col, Title, Flex } from "@lamk/blocks-ui";
import { Delivery as DeliveryType } from "@lamk/la-sdk/dist/models/delivery";
import { sdk } from "@lamk/la-sdk";
import { getDelivery } from "../../../state/modules/delivery/delivery.selector";
import { useSelector } from "react-redux";
import isEqual from "lodash/isEqual";
import { setDelivery } from "../../../state/modules/delivery/delivery.module";
import { getStore } from "../../../state/modules/store/store.selector";
import { DeliveryForm } from "../../shared/forms/DeliveryForm";
import { useCall } from "../../shared/hooks/useCall";
import { FindResult } from "@lamk/la-sdk/dist/setup";
import { useTranslation } from "react-i18next";

export const Delivery = () => {
  const [caller, showSpinner] = useCall();
  const delivery = useSelector(getDelivery);
  const store = useSelector(getStore);
  const storeId = store ? store._id : undefined;
  const { t } = useTranslation();

  useEffect(() => {
    if (store) {
      caller<FindResult<DeliveryType>>(
        sdk.delivery.findForStore(store._id),
        (deliveries) => {
          if (deliveries.total > 0) {
            return setDelivery(deliveries.data[0]);
          }
        }
      );
    }
  }, [caller, store]);

  const handleSetupDeliveryDone = (newDelivery?: DeliveryType) => {
    if (!newDelivery || isEqual(delivery, newDelivery)) {
      return;
    }

    caller<DeliveryType>(sdk.delivery.patch(newDelivery._id, newDelivery), setDelivery);
  };

  return (
    <Flex flexDirection="column" px={[3, 3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        {t("commerce.delivery")}
      </Title>
      <Col my={3}>
        <Spin spinning={showSpinner} tip={t("delivery.updatingDeliveryTip")}>
          <DeliveryForm
            storeId={storeId}
            delivery={delivery}
            onDone={handleSetupDeliveryDone}
          />
        </Spin>
      </Col>
    </Flex>
  );
};
