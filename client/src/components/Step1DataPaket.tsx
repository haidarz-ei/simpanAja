import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, User, MapPin, Plus, History, Search, Edit, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type Address = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  district: string;
  postalCode: string;
  type: "sender" | "receiver";
};

interface Step1DataPaketProps {
  formData: {
    senderName: string;
    senderPhone: string;
    senderAddress: string;
    senderCity: string;
    senderProvince: string;
    senderDistrict: string;
    senderPostalCode: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    receiverCity: string;
    receiverProvince: string;
    receiverDistrict: string;
    receiverPostalCode: string;
    packageWeight: string;
    packageLength: string;
    packageWidth: string;
    packageHeight: string;
    packageDescription: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step1DataPaketProps['formData']>>;
  addressHistory: Address[];
  setAddressHistory: React.Dispatch<React.SetStateAction<Address[]>>;
  selectedSenderAddress: Address | null;
  setSelectedSenderAddress: React.Dispatch<React.SetStateAction<Address | null>>;
  selectedReceiverAddress: Address | null;
  setSelectedReceiverAddress: React.Dispatch<React.SetStateAction<Address | null>>;
  showSenderHistory: boolean;
  setShowSenderHistory: React.Dispatch<React.SetStateAction<boolean>>;
  showReceiverHistory: boolean;
  setShowReceiverHistory: React.Dispatch<React.SetStateAction<boolean>>;
  showSenderInputModal: boolean;
  setShowSenderInputModal: React.Dispatch<React.SetStateAction<boolean>>;
  showReceiverInputModal: boolean;
  setShowReceiverInputModal: React.Dispatch<React.SetStateAction<boolean>>;
  searchSenderHistory: string;
  setSearchSenderHistory: React.Dispatch<React.SetStateAction<string>>;
  searchReceiverHistory: string;
  setSearchReceiverHistory: React.Dispatch<React.SetStateAction<string>>;
  editingSenderId: string | null;
  setEditingSenderId: React.Dispatch<React.SetStateAction<string | null>>;
  editingReceiverId: string | null;
  setEditingReceiverId: React.Dispatch<React.SetStateAction<string | null>>;
  packingOptions: string[];
  setPackingOptions: React.Dispatch<React.SetStateAction<string[]>>;
  handleInputChange: (field: string, value: string) => void;
  handleEditSender: (address: Address) => void;
  handleDeleteSender: (id: string) => void;
  handleEditReceiver: (address: Address) => void;
  handleDeleteReceiver: (id: string) => void;
  calculateTotalCost: () => number;
}

export default function Step1DataPaket({
  formData,
  setFormData,
  addressHistory,
  setAddressHistory,
  selectedSenderAddress,
  setSelectedSenderAddress,
  selectedReceiverAddress,
  setSelectedReceiverAddress,
  showSenderHistory,
  setShowSenderHistory,
  showReceiverHistory,
  setShowReceiverHistory,
  showSenderInputModal,
  setShowSenderInputModal,
  showReceiverInputModal,
  setShowReceiverInputModal,
  searchSenderHistory,
  setSearchSenderHistory,
  searchReceiverHistory,
  setSearchReceiverHistory,
  editingSenderId,
  setEditingSenderId,
  editingReceiverId,
  setEditingReceiverId,
  packingOptions,
  setPackingOptions,
  handleInputChange,
  handleEditSender,
  handleDeleteSender,
  handleEditReceiver,
  handleDeleteReceiver,
  calculateTotalCost,
}: Step1DataPaketProps) {
  const handleDeselectSender = () => {
    setSelectedSenderAddress(null);
  };

  const handleDeselectReceiver = () => {
    setSelectedReceiverAddress(null);
  };
  return (
    <div className="space-y-6">
      {/* Data Pengirim */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Data Pengirim</h2>
          </div>
          {selectedSenderAddress ? (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{selectedSenderAddress.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedSenderAddress.phone}</div>
                  <div className="text-sm text-muted-foreground">{selectedSenderAddress.address}, {selectedSenderAddress.city}, {selectedSenderAddress.province}, {selectedSenderAddress.district} {selectedSenderAddress.postalCode}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSender(selectedSenderAddress)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeselectSender()}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center text-muted-foreground">
              Belum ada alamat pengirim dipilih
            </div>
          )}
          <div className="flex gap-2">
            <Dialog open={showSenderHistory} onOpenChange={setShowSenderHistory}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  Riwayat Alamat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Riwayat Alamat Pengirim</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Cari alamat..."
                      value={searchSenderHistory}
                      onChange={(e) => setSearchSenderHistory(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {addressHistory
                      .filter(addr => addr.type === 'sender' && addr.name.toLowerCase().includes(searchSenderHistory.toLowerCase()))
                      .map((address) => (
                        <div
                          key={address.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedSenderAddress(address);
                            setFormData({
                              ...formData,
                              senderName: address.name,
                              senderPhone: address.phone,
                              senderAddress: address.address,
                              senderCity: address.city,
                              senderProvince: address.province,
                              senderDistrict: address.district,
                              senderPostalCode: address.postalCode,
                            });
                            setShowSenderHistory(false);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">{address.name}</div>
                              <div className="text-sm text-muted-foreground">{address.phone}</div>
                              <div className="text-sm text-muted-foreground">{address.address}, {address.city}, {address.province} {address.postalCode}</div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditSender(address);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSender(address.id);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showSenderInputModal} onOpenChange={setShowSenderInputModal}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Alamat Baru
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSenderId ? 'Edit Alamat Pengirim' : 'Tambah Alamat Pengirim Baru'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newSenderName">Nama Lengkap</Label>
                    <Input
                      id="newSenderName"
                      value={formData.senderName}
                      onChange={(e) => handleInputChange('senderName', e.target.value)}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newSenderPhone">Nomor Telepon</Label>
                    <Input
                      id="newSenderPhone"
                      value={formData.senderPhone}
                      onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                      placeholder="Masukkan nomor telepon"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newSenderAddress">Detail Alamat</Label>
                    <Textarea
                      id="newSenderAddress"
                      value={formData.senderAddress}
                      onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                      placeholder="Masukkan detail alamat"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="newSenderProvince">Provinsi</Label>
                      <Input
                        id="newSenderProvince"
                        value={formData.senderProvince}
                        onChange={(e) => handleInputChange('senderProvince', e.target.value)}
                        placeholder="Provinsi"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newSenderCity">Kota/Kabupaten</Label>
                      <Input
                        id="newSenderCity"
                        value={formData.senderCity}
                        onChange={(e) => handleInputChange('senderCity', e.target.value)}
                        placeholder="Kota/Kabupaten"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newSenderDistrict">Kecamatan</Label>
                      <Input
                        id="newSenderDistrict"
                        value={formData.senderDistrict}
                        onChange={(e) => handleInputChange('senderDistrict', e.target.value)}
                        placeholder="Kecamatan"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newSenderPostalCode">Kode Pos</Label>
                    <Input
                      id="newSenderPostalCode"
                      value={formData.senderPostalCode}
                      onChange={(e) => handleInputChange('senderPostalCode', e.target.value)}
                      placeholder="Kode Pos"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (editingSenderId) {
                        const updatedAddress = { ...addressHistory.find(addr => addr.id === editingSenderId)!, name: formData.senderName, phone: formData.senderPhone, address: formData.senderAddress, city: formData.senderCity, province: formData.senderProvince, district: formData.senderDistrict, postalCode: formData.senderPostalCode };
                        setAddressHistory(prev => prev.map(addr =>
                          addr.id === editingSenderId ? updatedAddress : addr
                        ));
                        if (selectedSenderAddress && selectedSenderAddress.id === editingSenderId) {
                          setSelectedSenderAddress(updatedAddress);
                        }
                        setEditingSenderId(null);
                      } else {
                        const newAddress: Address = {
                          id: `sender-${Date.now()}`,
                          name: formData.senderName,
                          phone: formData.senderPhone,
                          address: formData.senderAddress,
                          city: formData.senderCity,
                          province: formData.senderProvince,
                          district: formData.senderDistrict,
                          postalCode: formData.senderPostalCode,
                          type: 'sender',
                        };
                        setAddressHistory(prev => [...prev, newAddress]);
                        setSelectedSenderAddress(newAddress);
                        setFormData({
                          ...formData,
                          senderName: newAddress.name,
                          senderPhone: newAddress.phone,
                          senderAddress: newAddress.address,
                          senderCity: newAddress.city,
                          senderProvince: newAddress.province,
                          senderDistrict: newAddress.district,
                          senderPostalCode: newAddress.postalCode,
                        });
                      }
                      setShowSenderInputModal(false);
                    }}
                  >
                    {editingSenderId ? 'Update Alamat' : 'Simpan Alamat'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Data Penerima */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Data Penerima</h2>
          </div>
          {selectedReceiverAddress ? (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{selectedReceiverAddress.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedReceiverAddress.phone}</div>
                  <div className="text-sm text-muted-foreground">{selectedReceiverAddress.address}, {selectedReceiverAddress.city}, {selectedReceiverAddress.province}, {selectedReceiverAddress.district} {selectedReceiverAddress.postalCode}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditReceiver(selectedReceiverAddress)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeselectReceiver()}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center text-muted-foreground">
              Belum ada alamat penerima dipilih
            </div>
          )}
          <div className="flex gap-2">
            <Dialog open={showReceiverHistory} onOpenChange={setShowReceiverHistory}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  Riwayat Alamat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Riwayat Alamat Penerima</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Cari alamat..."
                      value={searchReceiverHistory}
                      onChange={(e) => setSearchReceiverHistory(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {addressHistory
                      .filter(addr => addr.type === 'receiver' && addr.name.toLowerCase().includes(searchReceiverHistory.toLowerCase()))
                      .map((address) => (
                        <div
                          key={address.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedReceiverAddress(address);
                            setFormData({
                              ...formData,
                              receiverName: address.name,
                              receiverPhone: address.phone,
                              receiverAddress: address.address,
                              receiverCity: address.city,
                              receiverProvince: address.province,
                              receiverDistrict: address.district,
                              receiverPostalCode: address.postalCode,
                            });
                            setShowReceiverHistory(false);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">{address.name}</div>
                              <div className="text-sm text-muted-foreground">{address.phone}</div>
                              <div className="text-sm text-muted-foreground">{address.address}, {address.city}, {address.province} {address.postalCode}</div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditReceiver(address);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteReceiver(address.id);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showReceiverInputModal} onOpenChange={setShowReceiverInputModal}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Alamat Baru
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingReceiverId ? 'Edit Alamat Penerima' : 'Tambah Alamat Penerima Baru'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newReceiverName">Nama Lengkap</Label>
                    <Input
                      id="newReceiverName"
                      value={formData.receiverName}
                      onChange={(e) => handleInputChange('receiverName', e.target.value)}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newReceiverPhone">Nomor Telepon</Label>
                    <Input
                      id="newReceiverPhone"
                      value={formData.receiverPhone}
                      onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                      placeholder="Masukkan nomor telepon"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newReceiverAddress">Detail Alamat</Label>
                    <Textarea
                      id="newReceiverAddress"
                      value={formData.receiverAddress}
                      onChange={(e) => handleInputChange('receiverAddress', e.target.value)}
                      placeholder="Masukkan detail alamat"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="newReceiverProvince">Provinsi</Label>
                      <Input
                        id="newReceiverProvince"
                        value={formData.receiverProvince}
                        onChange={(e) => handleInputChange('receiverProvince', e.target.value)}
                        placeholder="Provinsi"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newReceiverCity">Kota/Kabupaten</Label>
                      <Input
                        id="newReceiverCity"
                        value={formData.receiverCity}
                        onChange={(e) => handleInputChange('receiverCity', e.target.value)}
                        placeholder="Kota/Kabupaten"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newReceiverDistrict">Kecamatan</Label>
                      <Input
                        id="newReceiverDistrict"
                        value={formData.receiverDistrict}
                        onChange={(e) => handleInputChange('receiverDistrict', e.target.value)}
                        placeholder="Kecamatan"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newReceiverPostalCode">Kode Pos</Label>
                    <Input
                      id="newReceiverPostalCode"
                      value={formData.receiverPostalCode}
                      onChange={(e) => handleInputChange('receiverPostalCode', e.target.value)}
                      placeholder="Kode Pos"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (editingReceiverId) {
                        const updatedAddress = { ...addressHistory.find(addr => addr.id === editingReceiverId)!, name: formData.receiverName, phone: formData.receiverPhone, address: formData.receiverAddress, city: formData.receiverCity, province: formData.receiverProvince, district: formData.receiverDistrict, postalCode: formData.receiverPostalCode };
                        setAddressHistory(prev => prev.map(addr =>
                          addr.id === editingReceiverId ? updatedAddress : addr
                        ));
                        if (selectedReceiverAddress && selectedReceiverAddress.id === editingReceiverId) {
                          setSelectedReceiverAddress(updatedAddress);
                        }
                        setEditingReceiverId(null);
                      } else {
                        const newAddress: Address = {
                          id: `receiver-${Date.now()}`,
                          name: formData.receiverName,
                          phone: formData.receiverPhone,
                          address: formData.receiverAddress,
                          city: formData.receiverCity,
                          province: formData.receiverProvince,
                          district: formData.receiverDistrict,
                          postalCode: formData.receiverPostalCode,
                          type: 'receiver',
                        };
                        setAddressHistory(prev => [...prev, newAddress]);
                        setSelectedReceiverAddress(newAddress);
                        setFormData({
                          ...formData,
                          receiverName: newAddress.name,
                          receiverPhone: newAddress.phone,
                          receiverAddress: newAddress.address,
                          receiverCity: newAddress.city,
                          receiverProvince: newAddress.province,
                          receiverDistrict: newAddress.district,
                          receiverPostalCode: newAddress.postalCode,
                        });
                      }
                      setShowReceiverInputModal(false);
                    }}
                  >
                    {editingReceiverId ? 'Update Alamat' : 'Simpan Alamat'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Detail Paket */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Detail Paket</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="packageWeight">Berat Paket (kg)</Label>
              <Input
                id="packageWeight"
                type="number"
                value={formData.packageWeight}
                onChange={(e) => handleInputChange('packageWeight', e.target.value)}
                placeholder="Masukkan berat paket"
              />
            </div>
            <div>
              <Label htmlFor="packageDescription">Deskripsi Paket</Label>
              <Input
                id="packageDescription"
                value={formData.packageDescription}
                onChange={(e) => handleInputChange('packageDescription', e.target.value)}
                placeholder="Jelaskan isi paket"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="packageLength">Panjang (cm)</Label>
              <Input
                id="packageLength"
                type="number"
                value={formData.packageLength}
                onChange={(e) => handleInputChange('packageLength', e.target.value)}
                placeholder="Panjang"
              />
            </div>
            <div>
              <Label htmlFor="packageWidth">Lebar (cm)</Label>
              <Input
                id="packageWidth"
                type="number"
                value={formData.packageWidth}
                onChange={(e) => handleInputChange('packageWidth', e.target.value)}
                placeholder="Lebar"
              />
            </div>
            <div>
              <Label htmlFor="packageHeight">Tinggi (cm)</Label>
              <Input
                id="packageHeight"
                type="number"
                value={formData.packageHeight}
                onChange={(e) => handleInputChange('packageHeight', e.target.value)}
                placeholder="Tinggi"
              />
            </div>
          </div>
          <div>
            <Label className="text-base font-medium">Opsi Packing Tambahan</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bubble"
                  checked={packingOptions.includes('bubble')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPackingOptions(prev => [...prev, 'bubble']);
                    } else {
                      setPackingOptions(prev => prev.filter(opt => opt !== 'bubble'));
                    }
                  }}
                />
                <Label htmlFor="bubble" className="text-sm">Bubble Wrap (+Rp 5.000)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cardboard"
                  checked={packingOptions.includes('cardboard')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPackingOptions(prev => [...prev, 'cardboard']);
                    } else {
                      setPackingOptions(prev => prev.filter(opt => opt !== 'cardboard'));
                    }
                  }}
                />
                <Label htmlFor="cardboard" className="text-sm">Kardus (+Rp 8.000)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wooden"
                  checked={packingOptions.includes('wooden')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPackingOptions(prev => [...prev, 'wooden']);
                    } else {
                      setPackingOptions(prev => prev.filter(opt => opt !== 'wooden'));
                    }
                  }}
                />
                <Label htmlFor="wooden" className="text-sm">Kayu (+Rp 25.000)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance"
                  checked={packingOptions.includes('insurance')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPackingOptions(prev => [...prev, 'insurance']);
                    } else {
                      setPackingOptions(prev => prev.filter(opt => opt !== 'insurance'));
                    }
                  }}
                />
                <Label htmlFor="insurance" className="text-sm">Asuransi (+Rp 10.000)</Label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 bg-muted/50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Biaya:</span>
          <span className="text-2xl font-bold text-primary">
            Rp {calculateTotalCost().toLocaleString('id-ID')}
          </span>
        </div>
        <div className="mt-2 text-right">
          <a href="#" className="text-sm text-primary hover:underline">Detail Harga</a>
        </div>
      </div>
    </div>
  );
}
