import { useState } from 'react';
import { Button, PageHeader } from '@ramme-io/ui';
import { AddItemsModal } from '../../../components/AddItemsModal';



const ItemSelectorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Prototype: Item Selection"
        description="This page demonstrates the 'Add Items' modal component."
      />
      <div className="mt-8">
        <Button onClick={() => setIsModalOpen(true)}>
          Open Modal
        </Button>
      </div>

      <AddItemsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ItemSelectorPage;