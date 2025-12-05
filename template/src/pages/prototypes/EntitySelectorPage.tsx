import { useState } from 'react';
import { Button, PageHeader } from '@ramme-io/ui';
import { AddEntitiesModal } from '../../components/AddEntitiesModal';



const EntitySelectorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Prototype: Entity Selection"
        description="This page demonstrates the 'Add Entities' modal component."
      />
      <div className="mt-8">
        <Button onClick={() => setIsModalOpen(true)}>
          Open Modal
        </Button>
      </div>

      <AddEntitiesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EntitySelectorPage;